"use client";

import type { Doc, Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { Button } from "@repo/ui/button";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { TextArea, TextField } from "@repo/ui/text-field";
import { useEffect, useRef, useState } from "react";
import { useMarkRequestThreadRead } from "@/lib/hooks/use-notifications";
import {
	usePostRequestMessage,
	useRequestMessages,
	useRequestRelayAddress,
} from "@/lib/hooks/use-request-messages";
import { useMyProfileRow } from "@/lib/hooks/use-user-profile";

function formatMessageTime(creationTime: number): string {
	try {
		return new Date(creationTime).toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	}
	catch {
		return "";
	}
}

export function RequestMessagesPanel({
	requestId,
	className = "",
}: {
	requestId: Id<"helpRequests">;
	className?: string;
}) {
	const me = useMyProfileRow();
	const messages = useRequestMessages(requestId);
	const relay = useRequestRelayAddress(requestId);
	const post = usePostRequestMessage();
	const markThreadRead = useMarkRequestThreadRead();
	const [draft, setDraft] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [relayOpen, setRelayOpen] = useState(false);
	const threadEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		void markThreadRead({ requestId });
	}, [markThreadRead, requestId]);

	useEffect(() => {
		threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages?.length]);

	if (messages === undefined || relay === undefined) {
		return (
			<section
				className={`flex flex-col rounded-5 bg-white p-5 shadow-brand sm:p-6 ${className}`}
			>
				<Text size={2} className="text-black/70">
					Loading messages…
				</Text>
			</section>
		);
	}

	async function handleSend() {
		const body = draft.trim();
		if (!body) {
			return;
		}
		setSubmitting(true);
		try {
			await post({ requestId, body });
			setDraft("");
		}
		catch (e) {
			console.error(e);
			window.alert(
				e instanceof Error ? e.message : "Could not send your message.",
			);
		}
		finally {
			setSubmitting(false);
		}
	}

	async function copyRelay() {
		const addr = relay?.relayAddress;
		if (!addr) {
			return;
		}
		try {
			await navigator.clipboard.writeText(addr);
		}
		catch {
			window.alert("Could not copy to clipboard.");
		}
	}

	return (
		<section
			aria-label="Messages"
			className={`flex min-h-0 flex-col rounded-5 bg-white shadow-brand ${className}`}
		>
			<div className="px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
				<Heading level={2} size={5} className="font-display font-extrabold text-black">
					Messages
				</Heading>
				<Text size={2} className="mt-1 font-medium text-black/70">
					Chat with your match about this request.
				</Text>
			</div>

			<div className="flex max-h-[min(28rem,55vh)] min-h-52 flex-1 flex-col gap-3 overflow-y-auto bg-surface-warm/60 px-4 py-4 sm:px-5">
				{messages.length === 0
					? (
							<div className="flex flex-1 items-center justify-center px-2 py-8 text-center">
								<Text size={2} color="gray">
									No messages yet. Say hello below, or use masked email if it&apos;s set
									up.
								</Text>
							</div>
						)
					: (
							messages.map((m: Doc<"requestMessages">) => {
								const mine = me != null && m.authorUserId === me._id;
								const viaEmail = m.source === "email";
								const time = formatMessageTime(m._creationTime);
								return (
									<div
										key={m._id}
										className={`flex w-full flex-col gap-1 ${
											mine ? "items-end" : "items-start"
										}`}
									>
										<div
											className={`max-w-[min(85%,22rem)] px-3.5 py-2.5 ${
												mine
													? "rounded-[max(var(--radius-4),12px)] rounded-br-[max(var(--radius-1),4px)] border-2 border-terracotta-10 bg-terracotta-9 text-white"
													: "rounded-[max(var(--radius-4),12px)] rounded-bl-[max(var(--radius-1),4px)] border-2 border-gray-6 bg-white text-gray-12"
											}`}
										>
											<p className="whitespace-pre-wrap text-(length:--text-2) leading-snug">
												{m.body}
											</p>
										</div>
										<span
											className={`px-1 text-(length:--text-1) text-gray-10 ${
												mine ? "text-right" : "text-left"
											}`}
										>
											{mine ? "You" : "Your match"}
											{viaEmail ? " · via email" : ""}
											{time ? ` · ${time}` : ""}
										</span>
									</div>
								);
							})
						)}
				<div ref={threadEndRef} />
			</div>

			<div className="flex flex-col gap-3 px-5 py-5 sm:px-6">
				<TextField className="w-full">
					<Label>Message</Label>
					<Group>
						<TextArea
							value={draft}
							onChange={e => setDraft(e.target.value)}
							rows={3}
							placeholder="Write a message…"
							onKeyDown={(e) => {
								if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
									e.preventDefault();
									void handleSend();
								}
							}}
						/>
					</Group>
				</TextField>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						variant="solid"
						color="yellow"
						size={2}
						border="large"
						borderColor="terracotta"
						isDisabled={submitting || !draft.trim()}
						onPress={() => void handleSend()}
					>
						{submitting ? "Sending…" : "Send"}
					</Button>
					<Text size={1} className="text-black/50">
						⌘/Ctrl + Enter to send
					</Text>
				</div>

				<div className="border-t border-black/10 pt-3">
					<button
						type="button"
						className="flex w-full items-center justify-between gap-2 rounded-2 px-1 py-1 text-left outline-none ring-gray-8 hover:bg-surface-warm focus-visible:ring-2"
						aria-expanded={relayOpen}
						onClick={() => setRelayOpen(open => !open)}
					>
						<Text size={2} weight="medium" className="text-black">
							Masked email
						</Text>
						<span className="text-(length:--text-1) text-black/50" aria-hidden>
							{relayOpen ? "Hide" : "Show"}
						</span>
					</button>
					{relayOpen
						? (
								<div className="mt-2 flex flex-col gap-2">
									{relay.relayAddress
										? (
												<>
													<Text size={2} color="gray">
														Email this address to reach your match without sharing your
														real address. Plain text only; keep it about this request.
													</Text>
													<code className="break-all rounded-2 border-2 border-gray-6 bg-gray-2 px-2 py-1.5 text-sm">
														{relay.relayAddress}
													</code>
													<Button
														size={1}
														variant="outline"
														color="gray"
														className="self-start"
														onPress={() => void copyRelay()}
													>
														Copy address
													</Button>
												</>
											)
										: (
												<Text size={2} color="gray">
													Relay email isn&apos;t configured yet (server needs
													EMAIL_RELAY_DOMAIN and inbound DNS).
												</Text>
											)}
								</div>
							)
						: null}
				</div>
			</div>
		</section>
	);
}
