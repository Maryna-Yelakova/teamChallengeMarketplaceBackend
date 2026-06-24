export declare class Coupon {
    id: string;
    code: string;
    description?: string;
    discountType: "percent" | "fixed";
    discountValue: number;
    minOrderAmount?: number;
    expiresAt?: Date;
    maxUsageCount?: number;
    usedCount: number;
    isActive: boolean;
    createdAt: Date;
}
