import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = join("src", "routes", "admin");
const AUTH_IMPORTS =
  /import \{ authenticate \} from "\.\.\/\.\.\/middlewares\/authenticate";\r?\nimport \{ authorize \} from "\.\.\/\.\.\/middlewares\/authorize";/;
const ADMIN_CONFIG_IMPORT = /import \{ ADMIN_PANEL_ROLES \} from "\.\.\/\.\.\/config\/admin\.config";\r?\n/;

const CMS_OVERRIDES = new Set(["teamMember.routes.ts"]);
const LEGACY_GUARDS = [
  { legacy: 'router.use(authenticate, authorize("admin", "editor"));', guard: "cmsAccess" },
  { legacy: "router.use(authenticate, authorize(...ADMIN_PANEL_ROLES));", guard: "superAdminAccess" },
];

for (const file of readdirSync(ROUTES_DIR).filter((name) => name.endsWith(".routes.ts"))) {
  const path = join(ROUTES_DIR, file);
  const source = readFileSync(path, "utf8");
  const entry = LEGACY_GUARDS.find(({ legacy }) => source.includes(legacy));
  if (!entry) continue;

  const guard = CMS_OVERRIDES.has(file) ? "cmsAccess" : entry.guard;
  const migrated = source
    .replace(entry.legacy, `router.use(...${guard});`)
    .replace(ADMIN_CONFIG_IMPORT, "")
    .replace(AUTH_IMPORTS, `import { ${guard} } from "../../middlewares/access";`);

  writeFileSync(path, migrated);
  console.log(`${file} -> ${guard}`);
}