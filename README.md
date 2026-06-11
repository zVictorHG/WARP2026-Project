<p align="center">
    <img src="Images/logo.png?raw=true" alt="Warp logo" width=128 height=128>
</p>

# Win App Revamp Package
![License](https://img.shields.io/github/license/Neo-Mind/WARP)
![RepoSize](https://img.shields.io/github/repo-size/Neo-Mind/WARP)
![Commit](https://img.shields.io/github/last-commit/Neo-Mind/WARP)
![DiscordInfo](https://img.shields.io/discord/780647066871136266?label=Discord&logo=Discord&logoColor=white)

WARP is a package of tools for Querying and Revamping a 32 bit Windows Application by means of JS (ECMA-262) Scripts.<br>
The core tools were written in C++ utilizing the versatile Qt Framework, while the tools themselves provide APIs extending traditional JS for writing the scripts.

[Wiki](https://github.com/zVictorHG) | [Discord](zvictorhg) | [Issues](https://github.com/zVictorHG) | [Feature Requests](https://github.com/zVictorHG) | [Changelog](CHANGELOG.md)
---|---|---|---

## What's included
The package follows the file hierarchy as shown below.

```text
WARP/
│
├── README.md        (This readme file)
│
├── LICENSE          (GPL-3.0 license file)
│
├── ICON_attribution (Attribution for the tool icons & the logo)
│
├── Patches.yml      (YAML file describing all the patches)
│
├── Extensions.yml   (YAML file describing all the extensions)
│
├── Settings.yml     (YAML file containing all the tool settings)
│
├── LastSession.yml  (YAML session file from the last patch application)
│
├── Wiki/     (The Wiki's repository)
│
├── Fonts/    (All fonts contained in here are automatically loaded. NovaFlat is used as default.)
│   │
│   ├── NovaFlat-Bold.ttf
│   └── NovaFlat.ttf
│
├── Images/   (Contains all images used by the Tools.)
│   │
│   ├── Wiki (Images used in the Wiki)
│   │
│   ├── Dark_Mode (Overrides used in Dark Mode)
│   │   ├── bold_on.png
│   │   ├── error_header.png
│   │   ├── github_a.png
│   │   ├── github_i.png
│   │   ├── grip.png
│   │   ├── italic_on.png
│   │   ├── query_header.png
│   │   ├── success_header.png
│   │   └── warn_header.png
│   │
│   ├── actns_a.png
│   ├── actns_i.png
│   ├── ascend.png
│   ├── bold_off.png
│   ├── bold_on.png
│   ├── browse_a.png
│   ├── browse_i.png
│   ├── clear_a.png
│   ├── clear_i.png
│   ├── descend.png
│   ├── discord_a.png
│   ├── discord_i.png
│   ├── error_header.png
│   ├── extns_a.png
│   ├── extns_i.png
│   ├── github_a.png
│   ├── github_i.png
│   ├── grip.png
│   ├── info_a.png
│   ├── info_i.png
│   ├── italic_off.png
│   ├── italic_on.png
│   ├── logo.png
│   ├── next_a.png
│   ├── next_i.png
│   ├── prev_a.png
│   ├── prev_i.png
│   ├── query_header.png
│   ├── rcmd_i.png
│   ├── rcmd_s.png
│   ├── search.png
│   ├── success_header.png
│   └── warn_header.png
│
├── Scripts/
│   │
│   ├── Support/        (Contains all scripts which add supporting data & functions for Patches & Extensions.)
│   │   │
│   │   ├── Addons.qjs            (Implements addons to the existing Prototypes)
│   │   ├── AllDebug.qjs          (Implements functions used for debugging)
│   │   ├── AllFuncs.qjs          (Implements supporting functions)
│   │   ├── Class_IPrefix.qjs     (Represents Instruction Prefix)
│   │   ├── Class_Instr.qjs       (Represents Instruction)
│   │   ├── Class_ModRM.qjs       (Represents ModRM byte)
│   │   ├── Class_OpData.qjs      (Represents Operational Data)
│   │   ├── Class_PtrSize.qjs     (Represents Memory Pointer size)
│   │   ├── Class_Register.qjs    (Represents CPU register)
│   │   ├── Class_SIBase.qjs      (Represents SIB byte)
│   │   ├── Constants.qjs         (Commonly used constants)
│   │   ├── Instructions.qjs      (Generic instruction generators)
│   │   ├── Instructions_ST.qjs   (ST based instruction generators)
│   │   └── Instructions_XMM.qjs  (XMM based instruction generators)
│   │
│   ├── Patches/      (Contains all scripts implementing Patches)
│   │
│   ├── Extensions/   (Contains all scripts implementing Extensions)
│   │
│   └── Init/         (Contains all initialization scripts. Gets loaded each time an app is loaded)
│
├── Languages/   (Contains all Language description YAML files)
│                
├── Styles/      (Contains all Styling description YAML files)
│                
├── Inputs/      (Contains all input files for Patches & Extensions here)
│                
├── Outputs/     (Use this folder for generating files from Extensions & Patches)
│
└── <os_specific_folder>/    (Contains the tools along with DLL/SO files)
```

## Supported Platforms
- Windows (Only this version is available as of now but will be extended to other platforms later)

## Quick Links
