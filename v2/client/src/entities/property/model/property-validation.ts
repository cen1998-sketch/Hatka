import { z } from "zod";

/**
 * Step 1: Property Type & Subtype
 */
export const step1TypeSchema = z.object({
  type: z.enum(["HOTEL_ROOM", "APARTMENT", "HOUSE", "PRIVATE_ROOM"]),
  subType: z.string().min(1, "Выберите подкатегорию"),
});

/**
 * Step 2: Location
 */
export const step2LocationSchema = z.object({
  city: z.string().min(2, "Укажите город"),
  address: z.string().min(10, "Укажите полный адрес (улица, дом, кв)"),
});

/**
 * Step 3: Basic Info
 */
export const step3BasicInfoSchema = z.object({
  title: z.string()
    .min(10, "Название должно быть не менее 10 символов")
    .max(100, "Название слишком длинное"),
  pricePerNight: z.number().min(1, "Цена должна быть выше 0").optional(),
});

/**
 * Step 4: Rules (Optional validation, but good to have)
 */
export const step4RulesSchema = z.object({
  checkIn: z.string().min(1, "Укажите время заезда"),
  checkOut: z.string().min(1, "Укажите время выезда"),
});

/**
 * Step 5: Amenities (At least one or just object)
 */
export const step5AmenitiesSchema = z.object({
  amenities: z.array(z.string()).optional(),
});

/**
 * Step 6: Photos (Minimum 3)
 */
export const step6PhotosSchema = z.object({
  images: z.array(z.string()).min(3, "Загрузите не менее 3-х фотографий для публикации"),
});

/**
 * Step 7: Description
 */
export const step7DescriptionSchema = z.object({
  description: z.string().min(50, "Описание должно быть содержательным (минимум 50 символов)"),
});

/**
 * Rooms (Inner category for Hotels)
 */
export const roomSchema = z.object({
  title: z.string().min(3, "Название категории (например, 'Люкс')"),
  price: z.number().min(1, "Укажите цену за ночь"),
  capacity: z.number().min(1, "Укажите вместимость"),
  beds: z.number().min(1, "Укажите количество спальных мест"),
  area: z.number().optional(),
});

/**
 * Helper to get schema by step
 */
export const getStepSchema = (step: number) => {
  switch (step) {
    case 1: return step1TypeSchema;
    case 2: return step2LocationSchema;
    case 3: return step3BasicInfoSchema;
    case 4: return step4RulesSchema;
    case 5: return step5AmenitiesSchema;
    case 6: return step6PhotosSchema;
    case 7: return step7DescriptionSchema;
    default: return null;
  }
};
