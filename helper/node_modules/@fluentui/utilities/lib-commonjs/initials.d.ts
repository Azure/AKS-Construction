/**
 * Regular expressions matching characters to ignore when calculating the initials.
 */
/**
 * Get (up to 2 characters) initials based on display name of the persona.
 *
 * @public
 */
export declare function getInitials(displayName: string | undefined | null, isRtl: boolean, allowPhoneInitials?: boolean): string;
