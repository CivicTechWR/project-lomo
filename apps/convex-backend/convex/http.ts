import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { resendInboundWebhook } from "./resendInboundHttp";

const http = httpRouter();

http.route({
	path: "/webhooks/resend-inbound",
	method: "POST",
	handler: resendInboundWebhook,
});

authComponent.registerRoutes(http, createAuth);

export default http;
