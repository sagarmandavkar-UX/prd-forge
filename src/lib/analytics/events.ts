export type AnalyticsEventName =
  | "account_created"
  | "demo_entered"
  | "project_created"
  | "discovery_completed"
  | "prd_generated"
  | "section_edited"
  | "section_regenerated"
  | "quality_review_completed"
  | "requirement_added"
  | "version_created"
  | "export_completed"
  | "share_link_created";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: Record<string, string | number | boolean>;
  occurredAt: string;
}

export interface AnalyticsClient {
  track(
    event: AnalyticsEventName,
    properties?: AnalyticsEvent["properties"]
  ): void;
}

export const analytics: AnalyticsClient = {
  track(event, properties) {
    if (typeof window === "undefined") {
      return;
    }

    const payload: AnalyticsEvent = {
      name: event,
      properties,
      occurredAt: new Date().toISOString()
    };

    const existing = window.localStorage.getItem("prd-forge.analytics");
    const events = existing ? (JSON.parse(existing) as AnalyticsEvent[]) : [];
    events.push(payload);
    window.localStorage.setItem(
      "prd-forge.analytics",
      JSON.stringify(events.slice(-100))
    );
  }
};
