const modules = import.meta.glob("./*.json", { eager: true });

export default Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.slice(2, -5), mod.default])
);
