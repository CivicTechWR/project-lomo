import {
	Badge,
	Button,
	Card,
	Checkbox,
	CheckboxGroup,
	CheckboxIndicator,
	Description,
	FieldError,
	Heading,
	Label,
	Text,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";

const COLORS = ["terracotta", "sage", "yellow", "gray", "red", "amber"] as const;
const VARIANTS = ["surface", "classic"] as const;
const SIZES = [1, 2, 3] as const;

const CHECKBOX_PROPS = [
	{ name: "variant", type: "\"surface\" | \"classic\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"terracotta\"" },
	{ name: "isDisabled", type: "boolean", default: "false" },
	{ name: "isIndeterminate", type: "boolean", default: "false" },
	{ name: "isSelected", type: "boolean", default: "undefined" },
	{ name: "value", type: "string", default: "undefined" },
];

const CHECKBOX_GROUP_PROPS = [
	{ name: "value", type: "string[]", default: "undefined" },
	{ name: "onChange", type: "(value: string[]) => void", default: "undefined" },
	{ name: "isRequired", type: "boolean", default: "false" },
	{ name: "isInvalid", type: "boolean", default: "false" },
	{ name: "variant", type: "\"surface\" | \"classic\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"terracotta\"" },
];

const CHECKBOX_INDICATOR_PROPS = [
	{ name: "variant", type: "\"surface\" | \"classic\"", default: "\"surface\"" },
	{ name: "size", type: "1 | 2 | 3", default: "2" },
	{ name: "color", type: "\"terracotta\" | \"sage\" | ... | \"amber\"", default: "\"terracotta\"" },
	{ name: "className", type: "string", default: "undefined" },
];

function CheckboxPage() {
	const [groupValue, setGroupValue] = useState<string[]>([]);
	const [singleChecked, setSingleChecked] = useState(true);
	const [groupSelected, setGroupSelected] = useState<string[]>(["email", "digest"]);

	// Volunteer notification settings (select-all pattern)
	const [notifPrefs, setNotifPrefs] = useState<string[]>(["nearby", "updates"]);
	const notifChannels = ["nearby", "urgent", "updates", "digest"];
	const allNotifsSelected = notifPrefs.length === notifChannels.length;
	const someNotifsSelected = notifPrefs.length > 0 && !allNotifsSelected;

	// Privacy & consent
	const [consentPrefs, setConsentPrefs] = useState<string[]>([]);
	const optionalConsents = ["phone", "directory", "photos"];

	// Help categories (nested indeterminate)
	const [helpOffers, setHelpOffers] = useState<string[]>(["food", "transport"]);
	const essentialServices = ["housing", "food", "transport"];
	const communitySupport = ["legal", "health", "employment"];
	const allEssentialSelected = essentialServices.every(c => helpOffers.includes(c));
	const someEssentialSelected = essentialServices.some(c => helpOffers.includes(c)) && !allEssentialSelected;
	const allCommunitySelected = communitySupport.every(c => helpOffers.includes(c));
	const someCommunitySelected = communitySupport.some(c => helpOffers.includes(c)) && !allCommunitySelected;

	return (
		<div className="flex flex-col gap-10">
			<PageHeader
				title="Checkbox"
				description="Allows a user to select one or more items, or toggle a single option."
			/>

			{/* ── Playground ── */}

			<Playground
				componentName={values => values.grouped ? "CheckboxGroup" : "Checkbox"}
				childrenLabel={(values) => {
					if (values.grouped) {
						return [
							"<Label>How would you like to be notified?</Label>",
							"<Checkbox value=\"email\">",
							"  Email when someone responds to my request",
							"</Checkbox>",
							"<Checkbox value=\"sms\">",
							"  SMS for urgent matches nearby",
							"</Checkbox>",
							"<Checkbox value=\"digest\">",
							"  Weekly digest of community activity",
							"</Checkbox>",
							"<Description>You can change these anytime in your settings.</Description>",
						].join("\n  ");
					}
					return "Remember my preferences";
				}}
				snippetExclude={["grouped"]}
				defaults={{ variant: "surface", size: 2, color: "terracotta", isDisabled: false, isIndeterminate: false, grouped: false }}
				controls={[
					{ name: "variant", type: "segment", options: VARIANTS },
					{ name: "size", type: "segment", options: SIZES },
					{ name: "color", type: "segment", options: COLORS },
					{ name: "isDisabled", type: "toggle" },
					{ name: "isIndeterminate", type: "toggle" },
					{ name: "grouped", type: "toggle" },
				]}
				footer={values => (
					<Text size={1} color="gray">
						<code className="font-mono">
							{values.grouped
								? `Selected: ${JSON.stringify(groupSelected)}`
								: `State: ${singleChecked}`}
						</code>
					</Text>
				)}
				snippetPrefix={(values) => {
					if (values.grouped) {
						return "const [selected, setSelected] = useState([\"email\", \"digest\"]);";
					}
					return "const [checked, setChecked] = useState(true);";
				}}
				snippetExtraProps={(values) => {
					if (values.grouped) {
						return ["value={selected}", "onChange={setSelected}"];
					}
					return ["isSelected={checked}", "onChange={setChecked}"];
				}}
			>
				{(props) => {
					const v = props.variant as "surface" | "classic";
					const s = props.size as 1 | 2 | 3;
					const c = props.color as any;
					const disabled = props.isDisabled as boolean;
					const indeterminate = props.isIndeterminate as boolean;

					if (props.grouped) {
						return (
							<div className="w-full max-w-sm">
								<CheckboxGroup variant={v} size={s} color={c} value={groupSelected} onChange={setGroupSelected}>
									<Label>How would you like to be notified?</Label>
									<Checkbox value="email" isDisabled={disabled} isIndeterminate={indeterminate}>
										Email when someone responds to my request
									</Checkbox>
									<Checkbox value="sms" isDisabled={disabled} isIndeterminate={indeterminate}>
										SMS for urgent matches nearby
									</Checkbox>
									<Checkbox value="digest" isDisabled={disabled} isIndeterminate={indeterminate}>
										Weekly digest of community activity
									</Checkbox>
									<Description>You can change these anytime in your settings.</Description>
								</CheckboxGroup>
							</div>
						);
					}

					return (
						<Checkbox
							variant={v}
							size={s}
							color={c}
							isDisabled={disabled}
							isIndeterminate={indeterminate}
							isSelected={singleChecked}
							onChange={setSingleChecked}
						>
							Remember my preferences
						</Checkbox>
					);
				}}
			</Playground>

			{/* ── Anatomy ── */}

			<Anatomy
				parts={[
					{ label: "CheckboxIndicator", description: "The tick/dash box. Can be used standalone for custom layouts." },
					{ label: "Checkbox", description: "Root interactive element wrapping indicator + label. Built on react-aria-components." },
					{ label: "children", description: "Label text rendered beside the indicator." },
					{ label: "CheckboxGroup", description: "Context provider that passes variant/size/color to all child Checkboxes." },
				]}
			>
				<CheckboxGroup color="sage">
					<Checkbox value="one" defaultSelected>First option</Checkbox>
					<Checkbox value="two">Second option</Checkbox>
					<Checkbox value="three">Third option</Checkbox>
				</CheckboxGroup>
			</Anatomy>

			{/* ── Features ── */}

			<FeatureList
				features={[
					"Two visual variants (surface, classic) for different indicator styles.",
					"Three sizes.",
					"Six palette colors.",
					"Indeterminate state with dash indicator for \"select all\" controls.",
					"CheckboxGroup provides shared styling context (variant/size/color) to all children.",
					"Built on react-aria-components for full keyboard and screen reader support.",
					"Standalone CheckboxIndicator for custom checkbox layouts.",
				]}
			/>

			{/* ── Usage Guidelines ── */}

			<UsageGuidelines
				description="Use Checkbox for compact multi-select lists. Use CheckboxCard when each option needs more description or visual weight."
				guidelines={[
					{ type: "do", text: "Always wrap related checkboxes in CheckboxGroup for ARIA group semantics." },
					{ type: "do", text: "Use indeterminate state for 'select all' parent controls." },
					{ type: "do", text: "Provide meaningful labels — avoid generic 'Option 1' text." },
					{ type: "dont", text: "Don't use Checkbox for binary toggles that take immediate effect (use Switch when built)." },
					{ type: "dont", text: "Don't style individual checkboxes differently within a group." },
					{ type: "dont", text: "Don't use Checkbox without a visible label — if icon-only, use aria-label." },
				]}
			/>

			{/* ── Examples ── */}

			<DocSection title="Examples">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Volunteer Notifications"
						description="A settings panel combining select-all with a CheckboxGroup. The parent checkbox derives its state from the group — indeterminate when partially selected, checked when all are enabled."
						code={`const [selected, setSelected] = useState(["nearby", "updates"]);
const channels = ["nearby", "urgent", "updates", "digest"];
const allSelected = selected.length === channels.length;
const someSelected = selected.length > 0 && !allSelected;

<Card variant="surface" size={3}>
  <Heading level={3} size={3}>Notifications</Heading>
  <Text size={2} color="gray">
    Stay in the loop with your community.
  </Text>
  <Checkbox
    isSelected={allSelected}
    isIndeterminate={someSelected}
    onChange={(on) => setSelected(on ? [...channels] : [])}
    color="sage"
  >
    Enable all notifications
  </Checkbox>
  <CheckboxGroup value={selected} onChange={setSelected}
    color="sage" className="pl-6"
  >
    <Checkbox value="nearby">New requests nearby</Checkbox>
    <Checkbox value="urgent">Urgent matches</Checkbox>
    <Checkbox value="updates">Request status updates</Checkbox>
    <Checkbox value="digest">Weekly community digest</Checkbox>
  </CheckboxGroup>
</Card>`}
					>
						<Card variant="surface" size={3} className="w-full max-w-sm">
							<div className="flex flex-col gap-4">
								<div className="flex items-center justify-between">
									<Heading level={3} size={3}>Notifications</Heading>
									<Badge variant="soft" color="sage" size={1}>
										{notifPrefs.length}
										{" "}
										of
										{" "}
										{notifChannels.length}
									</Badge>
								</div>
								<Text size={2} color="gray">Stay in the loop with your community.</Text>
								<Checkbox
									isSelected={allNotifsSelected}
									isIndeterminate={someNotifsSelected}
									onChange={(checked: boolean) => setNotifPrefs(checked ? [...notifChannels] : [])}
									color="sage"
								>
									Enable all notifications
								</Checkbox>
								<div className="border-t border-gray-6" />
								<CheckboxGroup value={notifPrefs} onChange={setNotifPrefs} color="sage" className="pl-6">
									<Checkbox value="nearby">New requests nearby</Checkbox>
									<Checkbox value="urgent">Urgent matches</Checkbox>
									<Checkbox value="updates">Request status updates</Checkbox>
									<Checkbox value="digest">Weekly community digest</Checkbox>
								</CheckboxGroup>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Privacy & Consent"
						description="LoMo is consent-based — location sharing is required for matching, but other sharing preferences are optional. Decorative text lives outside the CheckboxGroup boundary; only Label, Description, FieldError, and Checkbox belong inside."
						code={`<Card variant="classic" size={3}>
  <Heading level={3} size={3}>Privacy Settings</Heading>
  <Text size={2} color="gray">
    Control what you share with your community.
  </Text>

  <Checkbox isSelected isDisabled color="sage">
    Share approximate location — required for matching
  </Checkbox>

  <CheckboxGroup value={prefs} onChange={setPrefs}>
    <Label>Optional sharing</Label>
    <Checkbox value="phone">
      Share phone number with matched volunteers
    </Checkbox>
    <Checkbox value="directory">
      Appear in the community directory
    </Checkbox>
    <Checkbox value="photos">
      Allow photos in request updates
    </Checkbox>
    <Description>
      You can change these anytime in your settings.
    </Description>
  </CheckboxGroup>
</Card>`}
					>
						<Card variant="classic" size={3} className="w-full max-w-md">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<Heading level={3} size={3}>Privacy Settings</Heading>
									<Text size={2} color="gray">Control what you share with your community.</Text>
								</div>

								<div className="flex items-center gap-2">
									<Checkbox isSelected isDisabled color="sage">Share approximate location — required for matching</Checkbox>
									<Badge variant="outline" color="sage" size={1}>Required</Badge>
								</div>

								<div className="border-t border-gray-6" />

								<CheckboxGroup value={consentPrefs} onChange={setConsentPrefs} color="terracotta">
									<Label>Optional sharing</Label>
									<Checkbox value="phone">Share phone number with matched volunteers</Checkbox>
									<Checkbox value="directory">Appear in the community directory</Checkbox>
									<Checkbox value="photos">Allow photos in request updates</Checkbox>
									<Description>You can change these anytime in your settings.</Description>
								</CheckboxGroup>

								<div className="flex gap-3 pt-2">
									<Button
										color="sage"
										onPress={() => setConsentPrefs([...optionalConsents])}
									>
										Allow all
									</Button>
									<Button variant="outline" color="gray">Save preferences</Button>
								</div>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Help Categories"
						description="Nested categories with indeterminate parent checkboxes. Each category reflects its children's state — checked when all selected, indeterminate when partially selected. Volunteers choose what kinds of help they can offer."
						code={`const [offers, setOffers] = useState(["food", "transport"]);
const essential = ["housing", "food", "transport"];
const community = ["legal", "health", "employment"];
const allEssential = essential.every(c => offers.includes(c));
const someEssential = essential.some(c => offers.includes(c)) && !allEssential;

<Checkbox
  isSelected={allEssential}
  isIndeterminate={someEssential}
  onChange={(on) => setOffers(prev =>
    on ? [...new Set([...prev, ...essential])]
       : prev.filter(c => !essential.includes(c))
  )}
  color="sage"
>
  Essential Services
</Checkbox>
<CheckboxGroup value={offers} onChange={setOffers}
  color="sage" className="pl-6"
>
  <Checkbox value="housing">Housing & shelter</Checkbox>
  <Checkbox value="food">Food & meals</Checkbox>
  <Checkbox value="transport">Getting around</Checkbox>
</CheckboxGroup>`}
					>
						<Card variant="surface" size={3} className="w-full max-w-sm">
							<div className="flex flex-col gap-5">
								<div className="flex flex-col gap-1">
									<Heading level={3} size={3}>I can help with...</Heading>
									<Text size={2} color="gray">
										{helpOffers.length}
										{" "}
										of
										{" "}
										{essentialServices.length + communitySupport.length}
										{" "}
										categories selected
									</Text>
								</div>

								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<Checkbox
											isSelected={allEssentialSelected}
											isIndeterminate={someEssentialSelected}
											onChange={(checked: boolean) => setHelpOffers(prev =>
												checked
													? [...new Set([...prev, ...essentialServices])]
													: prev.filter(c => !essentialServices.includes(c)),
											)}
											color="sage"
											size={2}
										>
											Essential Services
										</Checkbox>
										<Badge
											variant={allEssentialSelected ? "solid" : "soft"}
											color="sage"
											size={1}
										>
											{essentialServices.filter(c => helpOffers.includes(c)).length}
											/
											{essentialServices.length}
										</Badge>
									</div>
									<CheckboxGroup
										value={helpOffers}
										onChange={setHelpOffers}
										color="sage"
										size={1}
										className="pl-6"
									>
										<Checkbox value="housing">Housing & shelter</Checkbox>
										<Checkbox value="food">Food & meals</Checkbox>
										<Checkbox value="transport">Getting around</Checkbox>
									</CheckboxGroup>
								</div>

								<div className="border-t border-gray-6" />

								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between">
										<Checkbox
											isSelected={allCommunitySelected}
											isIndeterminate={someCommunitySelected}
											onChange={(checked: boolean) => setHelpOffers(prev =>
												checked
													? [...new Set([...prev, ...communitySupport])]
													: prev.filter(c => !communitySupport.includes(c)),
											)}
											color="terracotta"
											size={2}
										>
											Community Support
										</Checkbox>
										<Badge
											variant={allCommunitySelected ? "solid" : "soft"}
											color="terracotta"
											size={1}
										>
											{communitySupport.filter(c => helpOffers.includes(c)).length}
											/
											{communitySupport.length}
										</Badge>
									</div>
									<CheckboxGroup
										value={helpOffers}
										onChange={setHelpOffers}
										color="terracotta"
										size={1}
										className="pl-6"
									>
										<Checkbox value="legal">Legal aid</Checkbox>
										<Checkbox value="health">Health & wellness</Checkbox>
										<Checkbox value="employment">Employment support</Checkbox>
									</CheckboxGroup>
								</div>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Volunteer Availability"
						description="Color-coded checkbox groups using semantic colors to communicate different aspects of a volunteer's profile. Sage for schedule, amber for special capabilities, red for boundaries."
						code={`<div className="grid grid-cols-3 gap-4">
  <CheckboxGroup color="sage">
    <Label>Schedule</Label>
    <Checkbox value="weekdays" defaultSelected>Weekdays</Checkbox>
    <Checkbox value="weekends" defaultSelected>Weekends</Checkbox>
    <Checkbox value="evenings">Evenings</Checkbox>
  </CheckboxGroup>
  <CheckboxGroup color="amber">
    <Label>Capabilities</Label>
    <Checkbox value="vehicle">Has vehicle</Checkbox>
    <Checkbox value="accessible">Wheelchair accessible</Checkbox>
    <Checkbox value="multilingual">Multilingual</Checkbox>
  </CheckboxGroup>
  <CheckboxGroup color="red">
    <Label>Boundaries</Label>
    <Checkbox value="no-overnight">No overnight</Checkbox>
    <Checkbox value="no-lifting">No heavy lifting</Checkbox>
    <Checkbox value="no-driving">No long drives</Checkbox>
  </CheckboxGroup>
</div>`}
					>
						<Card variant="surface" size={3} className="w-full max-w-lg">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<Heading level={3} size={3}>Volunteer Profile</Heading>
									<Text size={2} color="gray">Help us match you with the right requests.</Text>
								</div>
								<div className="grid grid-cols-3 gap-6">
									<CheckboxGroup color="sage" size={1}>
										<Label>Schedule</Label>
										<Checkbox value="weekdays" defaultSelected>Weekdays</Checkbox>
										<Checkbox value="weekends" defaultSelected>Weekends</Checkbox>
										<Checkbox value="evenings">Evenings</Checkbox>
									</CheckboxGroup>
									<CheckboxGroup color="amber" size={1}>
										<Label>Capabilities</Label>
										<Checkbox value="vehicle">Has vehicle</Checkbox>
										<Checkbox value="accessible">Wheelchair accessible</Checkbox>
										<Checkbox value="multilingual">Multilingual</Checkbox>
									</CheckboxGroup>
									<CheckboxGroup color="red" size={1}>
										<Label>Boundaries</Label>
										<Checkbox value="no-overnight">No overnight</Checkbox>
										<Checkbox value="no-lifting">No heavy lifting</Checkbox>
										<Checkbox value="no-driving">No long drives</Checkbox>
									</CheckboxGroup>
								</div>
							</div>
						</Card>
					</CodeExample>

					<CodeExample
						title="Volunteer Sign-Up"
						description="CheckboxGroup with isRequired triggers native React Aria form validation on form submission. FieldError renders the validation message automatically."
						code={`<form>
  <CheckboxGroup isRequired>
    <Label>Community agreement</Label>
    <Checkbox value="guidelines">
      I agree to the community guidelines
    </Checkbox>
    <Checkbox value="verification">
      I consent to identity verification
    </Checkbox>
    <FieldError />
  </CheckboxGroup>
  <Button type="submit">Join LoMo</Button>
</form>`}
					>
						<Card variant="surface" size={3} className="w-full max-w-sm">
							<form className="flex flex-col gap-4">
								<Heading level={3} size={3}>Join your community</Heading>
								<CheckboxGroup isRequired>
									<Label>Community agreement</Label>
									<Checkbox value="guidelines">I agree to the community guidelines</Checkbox>
									<Checkbox value="verification">I consent to identity verification</Checkbox>
									<Description>Both are required to help keep LoMo safe for everyone.</Description>
									<FieldError />
								</CheckboxGroup>
								<Button type="submit" size={2}>Join LoMo</Button>
							</form>
						</Card>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── Visual Reference ── */}

			<DocSection title="Visual Reference">
				<div className="flex flex-col gap-8">
					<DemoSection title="Variant" description="Two visual styles for the indicator box.">
						<div className="flex flex-col gap-3">
							{VARIANTS.map(variant => (
								<Checkbox key={variant} variant={variant} defaultSelected>
									{variant.charAt(0).toUpperCase() + variant.slice(1)}
								</Checkbox>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Size" description="Three sizes for different density requirements.">
						<div className="flex flex-col gap-3">
							{SIZES.map(size => (
								<Checkbox key={size} size={size} defaultSelected>
									Size
									{" "}
									{size}
								</Checkbox>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Color" description="All palette colors, shown in checked and unchecked states.">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{COLORS.map(color => (
								<Checkbox key={color} color={color} defaultSelected>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Checkbox>
							))}
						</div>
						<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
							{COLORS.map(color => (
								<Checkbox key={color} color={color}>
									{color.charAt(0).toUpperCase() + color.slice(1)}
								</Checkbox>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Indeterminate" description="Dash indicator for partially selected state.">
						<div className="flex flex-col gap-3">
							{VARIANTS.map(variant => (
								<Checkbox key={variant} variant={variant} isIndeterminate>
									{`Indeterminate (${variant})`}
								</Checkbox>
							))}
						</div>
					</DemoSection>

					<DemoSection title="Disabled" description="Disabled state with reduced opacity.">
						<div className="flex flex-col gap-3">
							<Checkbox isDisabled>
								Unchecked disabled
							</Checkbox>
							<Checkbox isDisabled defaultSelected>
								Checked disabled
							</Checkbox>
						</div>
					</DemoSection>

					<DemoSection title="CheckboxGroup" description="Group with label, description, and field error integration.">
						<div className="flex flex-col gap-6">
							<CheckboxGroup
								color="sage"
								value={groupValue}
								onChange={setGroupValue}
							>
								<Label>Notification preferences</Label>
								<Checkbox value="email">
									Email notifications
								</Checkbox>
								<Checkbox value="sms">
									SMS notifications
								</Checkbox>
								<Checkbox value="push">
									Push notifications
								</Checkbox>
								<Description>Choose how you'd like to be contacted.</Description>
							</CheckboxGroup>

							<CheckboxGroup color="red" isInvalid isRequired>
								<Label>Terms</Label>
								<Checkbox value="terms">
									I agree to the terms and conditions
								</Checkbox>
								<FieldError>You must agree to continue.</FieldError>
							</CheckboxGroup>
						</div>
					</DemoSection>
				</div>
			</DocSection>

			{/* ── Context & Composition ── */}

			<DocSection title="Context & Composition">
				<div className="flex flex-col gap-8">
					<CodeExample
						title="Group Context Propagation"
						description="CheckboxGroup sets variant, size, and color via CheckboxGroupStyleContext. All child Checkboxes inherit these values automatically without passing props individually."
						code={`<CheckboxGroup color="sage" size={3}>
  <Label>Preferences</Label>
  <Checkbox value="a">Option A</Checkbox>
  <Checkbox value="b">Option B</Checkbox>
  <Checkbox value="c">Option C</Checkbox>
</CheckboxGroup>`}
					>
						<div className="w-full max-w-sm">
							<CheckboxGroup color="sage" size={3}>
								<Label>Preferences</Label>
								<Checkbox value="a">Option A</Checkbox>
								<Checkbox value="b">Option B</Checkbox>
								<Checkbox value="c">Option C</Checkbox>
							</CheckboxGroup>
						</div>
					</CodeExample>

					<CodeExample
						title="Overriding Group Context"
						description="Individual Checkboxes can override any style prop from the group. Here the last checkbox uses color=&quot;red&quot; while siblings inherit sage from the group."
						code={`<CheckboxGroup color="sage" size={3}>
  <Label>Settings</Label>
  <Checkbox value="updates" defaultSelected>
    Receive updates
  </Checkbox>
  <Checkbox value="marketing" defaultSelected>
    Marketing emails
  </Checkbox>
  <Checkbox value="delete" color="red">
    Delete my data on unsubscribe
  </Checkbox>
</CheckboxGroup>`}
					>
						<div className="w-full max-w-sm">
							<CheckboxGroup color="sage" size={3}>
								<Label>Settings</Label>
								<Checkbox value="updates" defaultSelected>Receive updates</Checkbox>
								<Checkbox value="marketing" defaultSelected>Marketing emails</Checkbox>
								<Checkbox value="delete" color="red">Delete my data on unsubscribe</Checkbox>
							</CheckboxGroup>
						</div>
					</CodeExample>

					<CodeExample
						title="Standalone CheckboxIndicator"
						description="CheckboxIndicator is the visual tick/dash box extracted as a standalone component. It reads styling from FieldContext, making it useful as a building block for custom checkbox layouts."
						code={`<CheckboxIndicator variant="surface" size={2} color="sage" />
<CheckboxIndicator variant="classic" size={2} color="sage" />
<CheckboxIndicator variant="surface" size={3} color="terracotta" />`}
					>
						<div className="flex items-center gap-4">
							<CheckboxIndicator variant="surface" size={2} color="sage" />
							<CheckboxIndicator variant="classic" size={2} color="sage" />
							<CheckboxIndicator variant="surface" size={3} color="terracotta" />
						</div>
					</CodeExample>

					<CodeExample
						title="RAC Slot Boundary"
						description="CheckboxGroup uses React Aria's slot system — it provides TextContext with two slots: description and errorMessage. Only Label, Description, FieldError, and Checkbox can be direct children. Placing Text or other RAC-based components inside the group throws a slot error. Keep decorative content outside the group boundary."
						code={`{/* ✗ Text inside CheckboxGroup — throws slot error */}
<CheckboxGroup>
  <Text size={2}>Nearby volunteers</Text>
  <Checkbox value="a">Option</Checkbox>
</CheckboxGroup>

{/* ✓ Text outside, group stays lean */}
<div>
  <Text size={2} color="gray">
    Choose which requests you'd like to see.
  </Text>
  <CheckboxGroup>
    <Label>Request types</Label>
    <Checkbox value="rides">Rides to appointments</Checkbox>
    <Checkbox value="errands">Errands & shopping</Checkbox>
    <Description>
      You'll be notified when matching requests appear.
    </Description>
  </CheckboxGroup>
</div>`}
					>
						<div className="flex w-full max-w-sm flex-col gap-3">
							<Text size={2} color="gray">Choose which requests you'd like to see.</Text>
							<CheckboxGroup color="sage">
								<Label>Request types</Label>
								<Checkbox value="rides" defaultSelected>Rides to appointments</Checkbox>
								<Checkbox value="errands">Errands & shopping</Checkbox>
								<Description>You'll be notified when matching requests appear.</Description>
							</CheckboxGroup>
						</div>
					</CodeExample>
				</div>
			</DocSection>

			{/* ── API Reference ── */}

			<DocSection title="API Reference">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-3">
						<Text size={3} weight="medium">Checkbox</Text>
						<PropTable data={CHECKBOX_PROPS} />
					</div>
					<div className="flex flex-col gap-3">
						<Text size={3} weight="medium">CheckboxGroup</Text>
						<PropTable data={CHECKBOX_GROUP_PROPS} />
					</div>
					<div className="flex flex-col gap-3">
						<Text size={3} weight="medium">CheckboxIndicator</Text>
						<PropTable data={CHECKBOX_INDICATOR_PROPS} />
					</div>
				</div>
			</DocSection>
		</div>
	);
}

export const Route = createFileRoute("/showcase/checkbox")({
	component: CheckboxPage,
});
