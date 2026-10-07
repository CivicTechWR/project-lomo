# Spec: Configurable Phone Number Validation

## Objective

Add phone-number validation and formatting to the onboarding “Stay in touch” step.

Users may optionally enter a phone number. The application must accept only phone numbers whose country is configured by an administrator, validate the complete number, format it as the user types, and store a normalized E.164 value.

## Assumptions

1. The application is a Next.js 16 web application with a Convex backend.
2. The current phone field is optional and is stored on the authenticated user profile.
3. The allowed countries are configured by an administrator and initially contain Canada and the United States.
4. The user chooses a country before entering the number.
5. The selected country is enforced on both the browser and Convex backend.
6. The frontend uses `libphonenumber-js` with the `max` metadata set for strict digit-level validation.
7. The backend uses the same library and metadata set.
8. Phone extensions are not supported in this feature.
9. The phone number is not verified via SMS or another provider.
10. The existing user-facing copy and onboarding flow remain otherwise unchanged.

## Scope

### In Scope

- An admin-configurable allowlist of country codes.
- A country selector in the onboarding “Stay in touch” step.
- Automatic formatting as the user types.
- Strict validation of the complete number for the selected country.
- Normalization to E.164 format before persistence.
- Backend validation to prevent clients from bypassing the rules.
- Accessible validation feedback.
- Unit and component tests for valid, invalid, empty, and formatted inputs.

### Out of Scope

- Phone-number verification, SMS codes, or carrier identity.
- Phone extensions.
- Country-specific flags or localized country names beyond the existing design system.
- A reusable phone-number component for unrelated forms.
- Rewriting existing stored phone values unless the user saves a changed value.

## User Stories

1. As an administrator, I can configure which countries are accepted for phone numbers.
2. As a user, I can select a configured country and enter a phone number.
3. As a user, I see the number formatted as I type.
4. As a user, I receive an accessible error when the number is invalid or the country is not allowed.
5. As a user, I can leave the phone number blank.
6. As a user, I can save a valid number and have it stored in a normalized format.
7. As an administrator, I can change the allowed countries without changing application code.

## Configuration Contract

The singleton admin settings document will add the following field:

```ts
phoneNumberCountries: string[]
```

The value contains two-letter ISO country codes. The default is:

```ts
["CA", "US"]
```

The backend will enforce these invariants:

- The array contains at least one country.
- Every entry is a supported country accepted by `libphonenumber-js`.
- Duplicate country codes are rejected.
- The array is bounded to a reasonable maximum, initially 20 countries.
- An empty array is rejected.

The existing admin-only settings query will continue to require administrator access. A separate public settings query will expose only the configured country codes needed by onboarding.

## Onboarding Behavior

The “Stay in touch” step will display:

1. A country selector with the configured countries as options.
2. A phone-number input.
3. A help message explaining that the number is optional.
4. An accessible validation message when the input is invalid.
5. A disabled Continue action while the number is invalid.
- A checkmark when the selected country and phone number are complete and valid.
- A cross when the phone number is incomplete or invalid.

The country selector must be required. The phone input must remain optional. If the field is left blank, the profile receives no phone value and no checkmark or cross is shown.

The checkmark or cross must be visually distinct, keyboard-accessible, and announced through the field's existing accessible description or error region. The indicator must not be the only way to communicate validation state; the same state must also be available as text.

## Validation Rules

### Formatting

The frontend will use `AsYouType` with the selected country. It will format valid prefixes and preserve the user’s ability to edit the value.

Examples:

- `+1 519 555 0100` → `+1 (519) 555-0100`
- `+14165550100` → `+1 (416) 555-0100`
- `5195550100` → `+1 (519) 555-0100` when the selected country is US
- `+1` → `+1` while the number is incomplete

Formatting must not be used as proof that the number is valid. A partial or invalid value may be formatted but must not enable saving.

### Validation

The frontend will use strict validation through `isValidPhoneNumber` or an equivalent parsed-number check with the selected country.

The backend will apply the same rules and additionally verify that:

- The selected country is in the configured allowlist.
- The normalized number belongs to the selected country.
- The input contains no unsupported extensions.
- The normalized E.164 value is complete and valid.

The frontend may display a country-specific message, but the backend error must not expose internal implementation details.

### Allowed Country Rule

A number with an international country code must match the selected country. For example, a US-selected number must not be accepted when its parsed country is Canada.

A national number entered with a selected country will be interpreted using that country. An international number with a `+` prefix will take precedence over the selected country, but the resulting country must still be in the allowlist.

## Persistence Contract

The submitted phone value will be normalized to E.164 format before it is persisted.

Example:

```text
+1 (519) 555-0100 → +15195550100
```

The existing `users.phone` field remains the storage location. No new database table or schema migration is required unless the admin configuration is changed in the existing settings document.

## API Contract

### Public configuration query

```ts
getPublicPhoneNumberSettings
```

Returns:

```ts
{
  countries: Array<{
    code: string;
    name: string;
  }>;
}
```

This query is intentionally public because onboarding users must receive the configured values before signing in.

### Admin settings query

The existing `getSettings` query will add:

```ts
phoneNumberCountries: string[]
```

### Admin settings mutation

The existing `updateSettings` mutation will accept an optional `phoneNumberCountries` argument.

The mutation must reject invalid country codes and preserve the current defaults when the field is omitted.

### Profile mutation

The existing `updatePublicProfile` mutation will accept a normalized E.164 phone value or `undefined` for an empty value. It must validate the value again before writing the profile.

## Error Handling

The user-facing error states are:

- Empty value: valid because the field is optional.
- Incomplete value: “Enter a complete phone number.”
- Invalid country or number: “Enter a valid phone number for the selected country.”
- Country not configured: “Phone numbers from this country are not currently allowed.”
- Save failure: “We could not save your phone number. Please try again.”

The frontend should never submit an invalid value. The backend must return a validation error rather than silently storing malformed data.

## Testing Strategy

### Unit Tests

Test the shared phone-number validation and normalization functions with real `libphonenumber-js` behavior:

- Empty input is allowed.
- US and Canadian valid numbers are accepted.
- Internationally formatted numbers are normalized.
- Invalid digit patterns are rejected.
- A number from an unconfigured country is rejected.
- A number whose parsed country does not match the selected country is rejected.
- Incomplete values are rejected when saved.

### Component Tests

Test the onboarding field through the real form component:

- Country options come from configuration.
- Formatting updates while typing.
- Invalid input shows an accessible error.
- Continue is disabled while invalid.
- Empty input is allowed.
- A valid number enables Continue.

### Backend Tests

Test the Convex mutation contract with real validation logic:

- Valid configured country and normalized number are accepted.
- Invalid number is rejected.
- Unconfigured country is rejected.
- Malformed country list is rejected by the admin mutation.
- Existing profile values remain unchanged when validation fails.

### Verification Commands

```bash
bun --filter=@repo/lomoweb run test
bun --filter=@repo/lomoweb run typecheck
bun --filter=@repo/lomoweb run lint
bun --filter=@repo/convex-backend run test
bun --filter=@repo/convex-backend run typecheck
bun --filter=@repo/convex-backend run lint
```

## Success Criteria

- The default admin configuration permits Canada and the United States.
- The onboarding form offers a country selector populated from that configuration.
- Valid numbers are automatically formatted.
- Invalid or unconfigured numbers cannot be saved.
- The backend independently rejects invalid data.
- Stored values use E.164 formatting.
- Empty values remain valid and optional.
- New behavior has tests covering validation, formatting, configuration, and persistence.
- Type checking, linting, unit tests, and the relevant frontend behavior pass.

## Open Questions

1. Should the country selector display only country names or also country codes?
2. Should the admin configuration permit only the two initial countries, or should it support any country accepted by the library?
3. Should the UI preserve the user’s country selection when the profile is reloaded?
4. Should the setting be editable through the existing admin settings page or a separate admin screen?

No implementation will begin until this specification is reviewed and approved.
