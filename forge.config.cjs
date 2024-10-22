const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    executableName: "Chaotic Capital",
    win32metadata: {
      FileDescription: "Chaotic Capital",
      ProductName: "Chaotic Capital",
    },
    icon: 'src/cc_new',
    ignore: [".dev", ".gitignore", "package-lock.json"]
  },
  rebuildConfig: {},
  targets: {},
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Spiderwatch',
          homepage: 'https://acethewildfire.me',
          categories: ['Game'],
          description: 'A game client for Chaotic Capital',
          name: 'Chaotic Capital',
          productName: 'Chaotic Capital',
          icon: 'src/cc_new',
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          homepage: 'https://acethewildfire.me',
          categories: ['Game'],
          description: 'A game client for Chaotic Capital',
          name: 'Chaotic Capital',
          productName: 'Chaotic Capital',
          icon: 'src/cc_new',
        }
      }
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        arch: ['x64', 'arm64'],
      }
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          categories: ['Games'],
          mimeType: ['x-scheme-handler/chaoticcapital']
        }
      }
    }
  ],
  plugins: [
    // {
    //   name: '@electron-forge/plugin-auto-unpack-natives',
    //   config: {},
    // },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
