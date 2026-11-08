"""Install or update the guide's WoW Forever addon set from CurseForge.

Usage (game closed):
    python -I tools/install_addons.py "C:/Program Files (x86)/World of Warcraft/_forever_/Interface/AddOns"

For every project below it picks the newest file CurseForge tags for WoW Forever,
downloads it into a fresh temp folder, and copies only the addon folders whose .toc
lists the Forever interface (16001). Folders for other WoW versions are skipped.
"""
import json, os, shutil, sys, tempfile, urllib.request, zipfile

FOREVER_TYPE_ID = 88568   # CurseForge game-version type for WoW Forever (1.60.x)
FOREVER_INTERFACE = "16001"

PROJECTS = {
    334372: "Questie",
    914482: "Baganator",
    988370: "Syndicator (Baganator needs it)",
    94855: "Leatrix Plus",
    298842: "Leatrix Maps",
    3358: "Deadly Boss Mods",
    16442: "DBM Vanilla raids",
    314994: "DBM Dungeons",
    6124: "Auctionator",
    1707971: "DungeonJournal",
    18808: "TomTom",
    26120: "GatherMate2",
    1704969: "ForeverThreat",
    4646: "Pawn (upgrade arrows)",
    1699589: "AtlasLoot Forever (loot tables + BiS)",
    1715322: "ForeverBiS (BiS lists, dungeon maps)",
    486246: "RestedXP Guide (free routes to ~20)",
}
HEADERS = {"User-Agent": "wow-forever-guide-installer/1.0"}


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def newest_forever_file(project_id):
    fallback = None
    for page in range(6):
        url = (f"https://www.curseforge.com/api/v1/mods/{project_id}/files"
               f"?pageIndex={page}&pageSize=50&sort=dateCreated&sortDescending=true")
        files = json.loads(fetch(url))["data"]
        for f in files:
            tagged = FOREVER_TYPE_ID in f.get("gameVersionTypeIds", []) or any(
                v.startswith("1.60") for v in f.get("gameVersions", []))
            if not tagged:
                continue
            if f["releaseType"] == 1:      # stable release
                return f
            fallback = fallback or f       # newest beta, used only if no release exists
        if fallback or not files:
            break
    return fallback


def loads_in_forever(folder):
    for name in os.listdir(folder):
        if name.lower().endswith(".toc"):
            with open(os.path.join(folder, name), encoding="utf-8", errors="ignore") as fh:
                if FOREVER_INTERFACE in fh.read(4000):
                    return True
    return False


def safe_extract(zip_path, dest):
    with zipfile.ZipFile(zip_path) as z:
        for member in z.namelist():
            parts = member.replace("\\", "/").split("/")
            if member.startswith("/") or ".." in parts:
                raise SystemExit(f"Refusing unsafe path in {zip_path}: {member}")
        z.extractall(dest)


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    addons_dir = sys.argv[1]
    os.makedirs(addons_dir, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="forever-addons-") as work:
        for project_id, label in PROJECTS.items():
            f = newest_forever_file(project_id)
            if not f:
                print(f"{label}: no Forever file on CurseForge, skipped")
                continue
            pdir = os.path.join(work, str(project_id))
            os.makedirs(pdir)
            zpath = os.path.join(pdir, "file.zip")
            with open(zpath, "wb") as fh:
                fh.write(fetch(f"https://www.curseforge.com/api/v1/mods/{project_id}/files/{f['id']}/download"))
            extracted = os.path.join(pdir, "x")
            safe_extract(zpath, extracted)
            installed = []
            for folder in sorted(os.listdir(extracted)):
                src = os.path.join(extracted, folder)
                if os.path.isdir(src) and loads_in_forever(src):
                    dst = os.path.join(addons_dir, folder)
                    shutil.rmtree(dst, ignore_errors=True)
                    shutil.copytree(src, dst)
                    installed.append(folder)
            print(f"{label}: {f['displayName']} -> {', '.join(installed) or 'nothing for Forever'}")


if __name__ == "__main__":
    main()
