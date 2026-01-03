import { IsOptional, IsInt, Min, Max, IsIn, IsString, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export const SORTABLE_FIELDS = [
    'email',
    'firstName',
    'lastName',
    'phone',
    'department',
    'position',
    'hireDate',
    'isActive',
    'createdAt',
] as const;

export type SortableField = (typeof SORTABLE_FIELDS)[number];

export type FilterBy = Partial<Record<SortableField, string | boolean | null>>;

export class FindAllDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value;
        return value.split(',').map((s: string) => s.trim());
    })
    ids?: string[];

    @IsOptional()
    @IsString()
    @IsIn(SORTABLE_FIELDS)
    sortBy?: SortableField = 'createdAt';

    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';

    @IsOptional()
    @IsString()
    @Transform(({ value }) => {
        if (!value) return undefined;
        try {
            return JSON.parse(value);
        } catch {
            return undefined;
        }
    })
    filterBy?: FilterBy;
}
