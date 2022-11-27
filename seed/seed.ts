
export abstract class Seeder {
	abstract seed(): Promise<void>;

	repeat<Entity, Item = Partial<Pick<Entity, keyof Entity>>>(n: number, generator: () => Item): Item[] {
		const result: Item[] = [];
		let i;

		for (i = 0; i < n; i++) {
			result.push(generator());
		}
		return result;
	}
}
