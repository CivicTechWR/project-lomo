"use client";

import { api } from "@repo/convex-backend/convex/_generated/api";
import type { Id } from "@repo/convex-backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@repo/ui/button";
import { Group, Label } from "@repo/ui/field";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { TextArea, TextField } from "@repo/ui/text-field";
import { useState } from "react";

export function RequestMessagesPanel({
	requestId,
}: {
	requestId: Id<"helpRequests">;
}) {
	const me = useQuery(api.auth.getCurrentUser);
	const messages = useQuery(api.requestMessages.listForRequest, { requestId });
	const relay = useQuery(api.requestMessages.getRelayAddressForRequest, {
		requestId,
	});
	const post = useMutation(api.requestMessages.post);
	const [draft, setDraft] = useState("");
	const [submitting, setSubmitting] = useState(false);

	if (messages === undefined || relay === undefined) {
		return (
			<Text size={2} color="gray">
				Loading messages…
			</Text>
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
		<div className="flex flex-col gap-4 rounded-lg border border-gray-6 bg-gray-1 p-4">
			<Heading level={2} size={5}>
				Messages
			</Heading>

			<div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
				{messages.length === 0 ? (
					<Text size={2} color="gray">
						No messages yet. Say hello below, or use masked email if it’s set up.
					</Text>
				) : (
					messages.map((m) => {
						const mine = m.authorSubject === me?.subject;
						const via
							= m.source === "email"
								? " · via email"
								: "";
						return (
							<div
								key={m._id}
								className={`flex min-w-0 flex-col gap-1 rounded-md border px-3 py-2 ${
									mine
										? "border-sage-7 bg-sage-3 ml-4"
										: "border-gray-6 bg-gray-2 mr-4"
								}`}
							>
								<Text size={1} color="gray">
									{mine ? "You" : "Your match"}
									{via}
								</Text>
								<Text size={2} className="whitespace-pre-wrap">
									{m.body}
								</Text>
							</div>
						);
					})
				)}
			</div>

			<TextField className="w-full">
				<Label>Message</Label>
				<Group>
					<TextArea
						value={draft}
						onChange={setDraft}
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
			<Button
				variant="solid"
				color="sage"
				className="self-start"
				isDisabled={submitting || !draft.trim()}
				onPress={() => void handleSend()}
			>
				{submitting ? "Sending…" : "Send"}
			</Button>
			<Text size={1} color="gray">
				Tip: Ctrl+Enter or ⌘+Enter to send.
			</Text>

			<div className="border-t border-gray-6 pt-4">
				<Text size={2} weight="medium" className="mb-1">
					Masked email
				</Text>
				{relay.relayAddress ? (
					<div className="flex flex-col gap-2">
						<Text size={2} color="gray">
							Email this address to reach your match without sharing your real
							address. Plain text only; keep it about this request.
						</Text>
						<code className="break-all rounded border border-gray-6 bg-gray-2 px-2 py-1 text-sm">
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
					</div>
				) : (
					<Text size={2} color="gray">
						Relay email isn’t configured yet (server needs EMAIL_RELAY_DOMAIN and
						inbound DNS).
					</Text>
				)}
			</div>
		</div>
	);
}
