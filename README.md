# MySkillsPlus – local workspace

## One-page hub (navigation like [myskillsplus.com](https://myskillsplus.com/))

```bash
cd local-portal
npm run dev
```

Open **http://localhost:3099/** — nav groups (Skillmap, Vani, use cases, employer / individual) link out to each **local** app in a new tab. This is a **dev launcher**, not a copy of production assets.

Edit **`local-portal/index.html`** → the `PORTS` object if your servers use different ports.

---

## Rough mapping: live site → folders here

| What [myskillsplus.com](https://myskillsplus.com/) describes | Folder(s) in this workspace |
| --- | --- |
| SkillMap / skills taxonomy & profiler | `iys-profiler-dev-app` |
| Individual / candidate app | `my-skills-plus-next-dev-app` |
| Partner portal | `partner-myskillsplus-next-main` |
| Admin | `admin-myskillsplus-next-live` |
| Employer / recruiter | `recruiter-myskillsplus-next-main` |
| Vani – AI assessment UI | `vani-assessment-module-main` |
| Backend API | `my-skills-plus-develop` |
| Embeddable profiler plugins (static) | `iys-skills-profiler-plugin-main`, `iys-skills-fresher-profiler-plugin-main` |
| DB dumps / snapshots | `IYS_14mar26` |

Default ports are documented in `local-portal/index.html`; confirm with each app’s `npm run dev` output.
