import { createFileRoute } from "@tanstack/react-router";
import { EolvLanding } from "@/components/EolvLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eolv — Privacy and security for the casual." },
      {
        name: "description",
        content:
          "A modular ecosystem built for clarity. Privacy-first, warm, cinematic. Everything runs locally in your browser.",
      },
      { property: "og:title", content: "Eolv — A modular ecosystem built for clarity." },
      {
        property: "og:description",
        content: "Privacy-first. Warm. Cinematic. Yours.",
      },
    ],
  }),
  component: EolvLanding,
});
