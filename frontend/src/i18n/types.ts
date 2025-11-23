import enTranslation from "../locales/en/translation.json";

// Extract all translation keys recursively
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Get all translation keys
export type TranslationKeys = NestedKeyOf<typeof enTranslation>;
