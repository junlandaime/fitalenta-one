export function updateAt<T>(items: T[], index: number, next: T): T[] {
    return items.map((item, position) => (position === index ? next : item));
}

export function removeAt<T>(items: T[], index: number): T[] {
    return items.filter((_, position) => position !== index);
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
    if (to < 0 || to >= items.length || from === to) return items;
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
}

export function collectListErrors(issues: { path: PropertyKey[]; message: string }[], field: string) {
    const errors: Record<string, string> = {};
    for (const issue of issues) {
        if (issue.path[0] !== field) continue;
        const key = issue.path.length === 1 ? "_" : issue.path.slice(1).join(".");
        errors[key] ??= issue.message;
    }
    return errors;
}
