export enum RankedStatus {
	Inactive = -3,
	NotSubmitted = -1,
	Pending = 0,
	UpdateAvailable = 1,
	Ranked = 2,
	Approved = 3,
	Qualified = 4,
	Loved = 5
}

export const statusIntToString = (statusInt: number): string => {
	switch (statusInt) {
		case RankedStatus.Loved:
			return 'Loved';
		case RankedStatus.Qualified:
			return 'Qualified';
		case RankedStatus.Approved:
			return 'Approved';
		case RankedStatus.Ranked:
			return 'Ranked';
		case RankedStatus.Pending:
			return 'Pending';
		case RankedStatus.NotSubmitted:
			return 'WIP';
		case RankedStatus.Inactive:
			return 'Graveyard';
		default:
			return 'Pending';
	}
};

export const statusStringToId = (statusString: string): RankedStatus => {
	const normalized = statusString.toLowerCase().trim();
	switch (normalized) {
		case 'inactive':
			return RankedStatus.Inactive;
		case 'notsubmitted':
		case 'wip':
			return RankedStatus.NotSubmitted;
		case 'pending':
			return RankedStatus.Pending;
		case 'updateavailable':
			return RankedStatus.UpdateAvailable;
		case 'ranked':
			return RankedStatus.Ranked;
		case 'approved':
			return RankedStatus.Approved;
		case 'qualified':
			return RankedStatus.Qualified;
		case 'loved':
			return RankedStatus.Loved;
		default:
			return RankedStatus.Pending;
	}
};

// per-mode rank status packed into one number: 3 bits per mode id (0-15).
// statuses aren't contiguous (-2 unused): -3->0, -1->1, 0->2, 1->3,
// 2->4, 3->5, 4->6, 5->7. mirrors forlorn.
// (bigint: JS bitwise ops are 32-bit, masks are 48-bit.)
const STATUS_CODES = [-3, -1, 0, 1, 2, 3, 4, 5];

export function statusAt(mask: number | bigint, mode: number): number {
	if (!Number.isInteger(mode) || mode < 0 || mode > 15) return RankedStatus.Pending;
	return STATUS_CODES[Number((BigInt(mask) >> BigInt(mode * 3)) & BigInt(7))];
}

export function withStatus(mask: number | bigint, mode: number, status: number): number {
	if (!Number.isInteger(mode) || mode < 0 || mode > 15) return Number(mask);
	const m = BigInt(mask);
	let code = STATUS_CODES.indexOf(status);
	if (code < 0) code = 2; // Pending
	const shift = BigInt(mode * 3);
	return Number((m & ~(BigInt(7) << shift)) | (BigInt(code) << shift));
}
