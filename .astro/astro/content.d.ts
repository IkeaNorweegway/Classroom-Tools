declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"lessons": {
"matter-01.md": {
	id: "matter-01.md";
  slug: "matter-01";
  body: string;
  collection: "lessons";
  data: InferEntrySchema<"lessons">
} & { render(): Render[".md"] };
};
"materials": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "materials";
  data: InferEntrySchema<"materials">;
  render(): Render[".md"];
}>;
"math9-units": {
"circle-geometry.md": {
	id: "circle-geometry.md";
  slug: "circle-geometry";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"linear-equations.md": {
	id: "linear-equations.md";
  slug: "linear-equations";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"linear-relations.md": {
	id: "linear-relations.md";
  slug: "linear-relations";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"measurement.md": {
	id: "measurement.md";
  slug: "measurement";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"polynomials.md": {
	id: "polynomials.md";
  slug: "polynomials";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"powers-exponents.md": {
	id: "powers-exponents.md";
  slug: "powers-exponents";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"probability.md": {
	id: "probability.md";
  slug: "probability";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"rational-numbers.md": {
	id: "rational-numbers.md";
  slug: "rational-numbers";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"similarity.md": {
	id: "similarity.md";
  slug: "similarity";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"square-roots.md": {
	id: "square-roots.md";
  slug: "square-roots";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
"statistics.md": {
	id: "statistics.md";
  slug: "statistics";
  body: string;
  collection: "math9-units";
  data: InferEntrySchema<"math9-units">
} & { render(): Render[".md"] };
};
"science7-units": {
"heat-temperature.md": {
	id: "heat-temperature.md";
  slug: "heat-temperature";
  body: string;
  collection: "science7-units";
  data: InferEntrySchema<"science7-units">
} & { render(): Render[".md"] };
"interactions-ecosystems.md": {
	id: "interactions-ecosystems.md";
  slug: "interactions-ecosystems";
  body: string;
  collection: "science7-units";
  data: InferEntrySchema<"science7-units">
} & { render(): Render[".md"] };
"planet-earth.md": {
	id: "planet-earth.md";
  slug: "planet-earth";
  body: string;
  collection: "science7-units";
  data: InferEntrySchema<"science7-units">
} & { render(): Render[".md"] };
"plants-food-fibre.md": {
	id: "plants-food-fibre.md";
  slug: "plants-food-fibre";
  body: string;
  collection: "science7-units";
  data: InferEntrySchema<"science7-units">
} & { render(): Render[".md"] };
"structures-forces.md": {
	id: "structures-forces.md";
  slug: "structures-forces";
  body: string;
  collection: "science7-units";
  data: InferEntrySchema<"science7-units">
} & { render(): Render[".md"] };
};
"social9-units": {
"canada-in-wwii.md": {
	id: "canada-in-wwii.md";
  slug: "canada-in-wwii";
  body: string;
  collection: "social9-units";
  data: InferEntrySchema<"social9-units">
} & { render(): Render[".md"] };
"evolving-citizenship.md": {
	id: "evolving-citizenship.md";
  slug: "evolving-citizenship";
  body: string;
  collection: "social9-units";
  data: InferEntrySchema<"social9-units">
} & { render(): Render[".md"] };
"independence-democratic-rights.md": {
	id: "independence-democratic-rights.md";
  slug: "independence-democratic-rights";
  body: string;
  collection: "social9-units";
  data: InferEntrySchema<"social9-units">
} & { render(): Render[".md"] };
"modern-economy.md": {
	id: "modern-economy.md";
  slug: "modern-economy";
  body: string;
  collection: "social9-units";
  data: InferEntrySchema<"social9-units">
} & { render(): Render[".md"] };
"postwar-canada.md": {
	id: "postwar-canada.md";
  slug: "postwar-canada";
  body: string;
  collection: "social9-units";
  data: InferEntrySchema<"social9-units">
} & { render(): Render[".md"] };
"system-of-government.md": {
	id: "system-of-government.md";
  slug: "system-of-government";
  body: string;
  collection: "social9-units";
  data: InferEntrySchema<"social9-units">
} & { render(): Render[".md"] };
"urbanization-industry.md": {
	id: "urbanization-industry.md";
  slug: "urbanization-industry";
  body: string;
  collection: "social9-units";
  data: InferEntrySchema<"social9-units">
} & { render(): Render[".md"] };
};
"teacher-lessons": {
"matter-01.md": {
	id: "matter-01.md";
  slug: "matter-01";
  body: string;
  collection: "teacher-lessons";
  data: InferEntrySchema<"teacher-lessons">
} & { render(): Render[".md"] };
};
"teacher-units": {
"climate.md": {
	id: "climate.md";
  slug: "climate";
  body: string;
  collection: "teacher-units";
  data: InferEntrySchema<"teacher-units">
} & { render(): Render[".md"] };
"energy-resources.md": {
	id: "energy-resources.md";
  slug: "energy-resources";
  body: string;
  collection: "teacher-units";
  data: InferEntrySchema<"teacher-units">
} & { render(): Render[".md"] };
"forces.md": {
	id: "forces.md";
  slug: "forces";
  body: string;
  collection: "teacher-units";
  data: InferEntrySchema<"teacher-units">
} & { render(): Render[".md"] };
"living-systems.md": {
	id: "living-systems.md";
  slug: "living-systems";
  body: string;
  collection: "teacher-units";
  data: InferEntrySchema<"teacher-units">
} & { render(): Render[".md"] };
"matter.md": {
	id: "matter.md";
  slug: "matter";
  body: string;
  collection: "teacher-units";
  data: InferEntrySchema<"teacher-units">
} & { render(): Render[".md"] };
"space.md": {
	id: "space.md";
  slug: "space";
  body: string;
  collection: "teacher-units";
  data: InferEntrySchema<"teacher-units">
} & { render(): Render[".md"] };
};
"units": {
"climate.md": {
	id: "climate.md";
  slug: "climate";
  body: string;
  collection: "units";
  data: InferEntrySchema<"units">
} & { render(): Render[".md"] };
"energy-resources.md": {
	id: "energy-resources.md";
  slug: "energy-resources";
  body: string;
  collection: "units";
  data: InferEntrySchema<"units">
} & { render(): Render[".md"] };
"forces.md": {
	id: "forces.md";
  slug: "forces";
  body: string;
  collection: "units";
  data: InferEntrySchema<"units">
} & { render(): Render[".md"] };
"living-systems.md": {
	id: "living-systems.md";
  slug: "living-systems";
  body: string;
  collection: "units";
  data: InferEntrySchema<"units">
} & { render(): Render[".md"] };
"matter.md": {
	id: "matter.md";
  slug: "matter";
  body: string;
  collection: "units";
  data: InferEntrySchema<"units">
} & { render(): Render[".md"] };
"space.md": {
	id: "space.md";
  slug: "space";
  body: string;
  collection: "units";
  data: InferEntrySchema<"units">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
