/**
 * Custom Convex ESLint rules.
 *
 * Reimplements the three recommended rules from @convex-dev/eslint-plugin
 * as plain ESLint rules with no dependency on @typescript-eslint/utils,
 * avoiding ESLint 10 compatibility issues.
 */

import { basename } from "node:path";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const CONVEX_REGISTRARS = [
	"query",
	"mutation",
	"action",
	"internalQuery",
	"internalMutation",
	"internalAction",
];

const EXT_RE = /\.[^.]+$/;

function isGenerated(filename) {
	return filename.includes("_generated");
}

/**
 * Simplified entry-point check. Convex entry points are files directly inside
 * the convex/ directory that are not generated, not schema files, and not
 * dotfiles / test files.
 */
function isEntryPoint(filename) {
	if (isGenerated(filename))
		return false;
	const base = basename(filename);
	if (base.startsWith(".") || base.startsWith("#"))
		return false;
	if (base === "schema.ts" || base === "schema.js")
		return false;
	// Files with multiple dots (e.g., file.test.ts) are not entry points
	const withoutExt = base.replace(EXT_RE, "");
	if (withoutExt.includes("."))
		return false;
	if (base.includes(" "))
		return false;
	return true;
}

/**
 * Check whether a node is inside an export declaration.
 */
function isExported(node) {
	const parentDecl = node.parent;
	if (!parentDecl)
		return false;
	const exportDecl = parentDecl.parent;
	return (
		exportDecl?.type === "ExportNamedDeclaration"
		|| parentDecl.parent?.parent?.type === "ExportNamedDeclaration"
	);
}

/**
 * Check whether a node is a call to a Convex registrar with a single argument.
 */
function isRegistrarCall(node) {
	return (
		node.init?.type === "CallExpression"
		&& node.init.callee.type === "Identifier"
		&& CONVEX_REGISTRARS.includes(node.init.callee.name)
		&& node.init.arguments.length === 1
	);
}

// ---------------------------------------------------------------------------
// Rule 1: no-old-registered-function-syntax
// ---------------------------------------------------------------------------

const noOldRegisteredFunctionSyntax = {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Don't use the non-object Convex function syntax. It's harder to add validation rules.",
			url: "https://docs.convex.dev/eslint#no-old-registered-function-syntax",
		},
		messages: {
			"use-object-syntax":
				"Use the object syntax for registered Convex queries, mutations, and actions.",
		},
		schema: [],
		fixable: "code",
	},
	create(context) {
		const { filename } = context;
		if (!isEntryPoint(filename))
			return {};

		return {
			VariableDeclarator(node) {
				if (!isExported(node))
					return;
				if (!isRegistrarCall(node))
					return;

				const arg = node.init.arguments[0];
				if (
					arg.type !== "ArrowFunctionExpression"
					&& arg.type !== "FunctionExpression"
				) {
					return;
				}

				context.report({
					node: node.init,
					messageId: "use-object-syntax",
					fix(fixer) {
						const hasArgsParam = arg.params.length >= 2;
						let fixText = "{\n";
						if (!hasArgsParam) {
							fixText += "  args: {},\n";
						}
						fixText += `  handler: ${context.sourceCode.getText(arg)}`;
						fixText += "\n}";
						return fixer.replaceText(arg, fixText);
					},
				});
			},
		};
	},
};

// ---------------------------------------------------------------------------
// Rule 2: require-args-validator
// ---------------------------------------------------------------------------

function hasArgsProperty(objectExpr) {
	return objectExpr.properties.some(
		prop =>
			prop.type === "Property"
			&& prop.key.type === "Identifier"
			&& prop.key.name === "args",
	);
}

function handlerHasArgsParameter(handler) {
	if (handler.params.length < 2)
		return false;
	const secondParam = handler.params[1];
	if (
		secondParam.type === "ObjectPattern"
		&& secondParam.properties.length === 0
	) {
		return false;
	}
	return true;
}

function getHandlerProperty(objectExpr) {
	const maybeHandler = objectExpr.properties.find(
		prop =>
			prop.type === "Property"
			&& prop.key.type === "Identifier"
			&& prop.key.name === "handler",
	);
	if (!maybeHandler)
		return null;
	if (
		maybeHandler.value.type === "ArrowFunctionExpression"
		|| maybeHandler.value.type === "FunctionExpression"
	) {
		return maybeHandler.value;
	}
	return null;
}

function createArgsFix(context, objectArg) {
	return (fixer) => {
		const objectText = context.sourceCode.getText(objectArg);
		const firstBracePos = objectText.indexOf("{");
		if (firstBracePos === -1)
			return null;
		const insertPos = objectArg.range[0] + firstBracePos + 1;
		return fixer.insertTextAfterRange([insertPos, insertPos], "\n  args: {},");
	};
}

const requireArgsValidator = {
	meta: {
		type: "suggestion",
		docs: {
			description: "Require argument validators (`args`) in Convex functions.",
			url: "https://docs.convex.dev/eslint#require-args-validator",
		},
		messages: {
			"missing-empty-args": "Convex function is missing args validator.",
			"missing-args":
				"Convex function is missing args validator but has parameter. Add appropriate args validator.",
		},
		schema: [
			{
				type: "object",
				properties: {
					ignoreUnusedArguments: {
						type: "boolean",
						description:
							"If true, don't require args validator when function doesn't use args parameter",
					},
				},
				additionalProperties: false,
			},
		],
		fixable: "code",
	},
	create(context) {
		const options = context.options[0] ?? {};
		const { ignoreUnusedArguments = false } = options;
		const { filename } = context;

		if (isGenerated(filename))
			return {};

		return {
			VariableDeclarator(node) {
				if (!isExported(node))
					return;
				if (!isRegistrarCall(node))
					return;

				const arg = node.init.arguments[0];

				// Old function syntax
				if (
					arg.type === "ArrowFunctionExpression"
					|| arg.type === "FunctionExpression"
				) {
					if (handlerHasArgsParameter(arg)) {
						context.report({
							node: node.init,
							messageId: "missing-args",
						});
						return;
					}
					if (!ignoreUnusedArguments) {
						context.report({
							node: node.init,
							messageId: "missing-empty-args",
							fix(fixer) {
								let fixText = "{\n";
								fixText += "  args: {},\n";
								fixText += `  handler: ${context.sourceCode.getText(arg)}`;
								fixText += "\n}";
								return fixer.replaceText(arg, fixText);
							},
						});
					}
					return;
				}

				// New object syntax
				if (arg.type === "ObjectExpression") {
					if (hasArgsProperty(arg))
						return;

					const handlerProp = getHandlerProperty(arg);
					const handlerHasArgs = handlerProp && handlerHasArgsParameter(handlerProp);

					if (!handlerHasArgs && ignoreUnusedArguments)
						return;

					context.report({
						node: arg,
						messageId: handlerHasArgs ? "missing-args" : "missing-empty-args",
						fix: handlerHasArgs ? undefined : createArgsFix(context, arg),
					});
				}
			},
		};
	},
};

// ---------------------------------------------------------------------------
// Rule 3: explicit-table-ids
// ---------------------------------------------------------------------------

const DB_METHODS = ["get", "replace", "patch", "delete"];

const explicitTableIds = {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Database operations should include an explicit table name as the first argument.",
			url: "https://docs.convex.dev/eslint#explicit-table-ids",
		},
		messages: {
			"missing-table-name":
				"Database {{method}} call should include an explicit table name as the first argument. Expected: db.{{method}}({{tableName}}, ...) ",
			"missing-table-name-no-inference":
				"Database {{method}} call should include an explicit table name as the first argument. Expected: db.{{method}}(<tableName>, ...).",
		},
		schema: [],
		fixable: "code",
	},
	create(context) {
		const { filename } = context;
		if (isGenerated(filename))
			return {};

		const services = context.sourceCode.parserServices;
		if (
			!services?.program
			|| !services.esTreeNodeToTSNodeMap
			|| typeof services.esTreeNodeToTSNodeMap.get !== "function"
		) {
			return {};
		}

		const checker = services.program.getTypeChecker();
		const tsNodeMap = services.esTreeNodeToTSNodeMap;

		// Resolve DatabaseReader / DatabaseWriter types from generated server module
		let anyDatabaseReader = null;
		let anyDatabaseWriter = null;
		try {
			const sourceFiles = services.program.getSourceFiles();
			for (const sf of sourceFiles) {
				if (!sf.fileName.includes("_generated/server"))
					continue;
				const sourceFileSymbol = checker.getSymbolAtLocation(sf);
				if (!sourceFileSymbol)
					continue;
				const exports = checker.getExportsOfModule(sourceFileSymbol);
				for (const exp of exports) {
					const type = checker.getTypeOfSymbolAtLocation(exp, sf);
					const typeString = checker.typeToString(type);
					if (
						typeString.includes("DatabaseReader")
						|| typeString.includes("GenericDatabaseReader")
					) {
						const dbProp = type.getProperty("db");
						if (dbProp) {
							anyDatabaseReader = checker.getTypeOfSymbolAtLocation(dbProp, sf);
						}
					}
					if (
						typeString.includes("DatabaseWriter")
						|| typeString.includes("GenericDatabaseWriter")
					) {
						const dbProp = type.getProperty("db");
						if (dbProp) {
							anyDatabaseWriter = checker.getTypeOfSymbolAtLocation(dbProp, sf);
						}
					}
				}
				break;
			}
		}
		catch {
			// Fall back to pattern matching
		}

		return {
			CallExpression(node) {
				if (node.callee.type !== "MemberExpression")
					return;

				const memberExpr = node.callee;
				if (memberExpr.property.type !== "Identifier")
					return;

				const methodName = memberExpr.property.name;
				if (!DB_METHODS.includes(methodName))
					return;

				// Check if the object is a database type
				const objectTsNode = tsNodeMap.get(memberExpr.object);
				const objectType = checker.getTypeAtLocation(objectTsNode);

				let isDatabaseType = false;
				if (anyDatabaseReader || anyDatabaseWriter) {
					isDatabaseType
						= (anyDatabaseReader !== null
							&& methodName === "get"
							&& checker.isTypeAssignableTo(objectType, anyDatabaseReader))
						|| (anyDatabaseWriter !== null
							&& checker.isTypeAssignableTo(objectType, anyDatabaseWriter));
				}
				else {
					const typeString = checker.typeToString(objectType);
					isDatabaseType
						= typeString.includes("DatabaseReader")
							|| typeString.includes("DatabaseWriter")
							|| typeString.includes("GenericDatabaseReader")
							|| typeString.includes("GenericDatabaseWriter");
				}

				// Also check for ctx.db pattern
				const isCtxDb
					= memberExpr.object.type === "MemberExpression"
						&& memberExpr.object.property.type === "Identifier"
						&& memberExpr.object.property.name === "db";

				if (!isDatabaseType && !isCtxDb)
					return;

				// Check argument count to detect unmigrated calls
				const args = node.arguments;
				const isUnmigrated
					= (methodName === "get" && args.length === 1)
						|| (methodName === "replace" && args.length === 2)
						|| (methodName === "patch" && args.length === 2)
						|| (methodName === "delete" && args.length === 1);

				if (!isUnmigrated)
					return;

				// Try to extract table name from Id<"tableName"> type
				const tsNode = tsNodeMap.get(args[0]);
				const type = checker.getTypeAtLocation(tsNode);
				let tableName = null;

				if (type.aliasSymbol?.name === "Id") {
					const typeArgs = type.aliasTypeArguments;
					if (typeArgs && typeArgs.length === 1) {
						const tableType = typeArgs[0];
						if (tableType.isStringLiteral && tableType.isStringLiteral()) {
							tableName = tableType.value;
						}
						// Fallback: StringLiteral flag = 128 = 1 << 7
						else if (tableType.flags & (1 << 7)) {
							tableName = tableType.value;
						}
					}
				}

				if (tableName) {
					context.report({
						node,
						messageId: "missing-table-name",
						data: { method: methodName, tableName: JSON.stringify(tableName) },
						fix(fixer) {
							const firstArg = args[0];
							if (!firstArg)
								return null;
							return fixer.insertTextBefore(
								firstArg,
								`${JSON.stringify(tableName)}, `,
							);
						},
					});
				}
				else {
					context.report({
						node,
						messageId: "missing-table-name-no-inference",
						data: { method: methodName },
					});
				}
			},
		};
	},
};

// ---------------------------------------------------------------------------
// Plugin export
// ---------------------------------------------------------------------------

export const convexPlugin = {
	meta: { name: "eslint-plugin-convex" },
	rules: {
		"no-old-registered-function-syntax": noOldRegisteredFunctionSyntax,
		"require-args-validator": requireArgsValidator,
		"explicit-table-ids": explicitTableIds,
	},
};
