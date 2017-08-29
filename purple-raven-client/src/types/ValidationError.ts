export interface ValidationError {
	validationError: boolean;
	fieldName: string;
	message: string;
	constraints?: string;
}
