/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "lpadder.",
  tagline: "With lpadder you do not need to pay $800 for Live Suite, you have everything in your browser, for FREE!",
  url: "https://docs.lpadder.ml",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // Even if you don't use internalization, you can use this field to set useful
  // Metadata like html lang. For example, if your site is Chinese, you may want
  // To replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"]
  },

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js")
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      title: "lpadder",
      metadata: [
        {
          name: "theme-color",
          content: "#0F172A"
        },
        {
          name: "title",
          content: "lpadder's documentation."
        },
        {
          name: "description",
          content: "Documentation of lpadder, a web application to help you build your next cover."
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:url",
          content: "https://docs.lpadder.ml"
        },
        {
          property: "og:title",
          content: "lpadder's documentation."
        },
        {
          property: "og:description",
          content: "Documentation of lpadder, a web application to help you build your next cover."
        },
        {
          property: "og:image",
          content: "/img/banner.png"
        },
        {
          property: "twitter:card",
          content: "summary_large_image"
        },
        {
          property: "twitter:url",
          content: "https://docs.lpadder.ml"
        },
        {
          property: "twitter:title",
          content: "lpadder's documentation."
        },
        {
          property: "twitter:description",
          content: "Documentation of lpadder, a web application to help you build your next cover."
        },
        {
          property: "twitter:image",
          content: "/img/banner.png"
        }
      ],
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false
      },
      navbar: {
        title: "lpadder",
        logo: {
          alt: "lpadder's logo",
          src: "/img/lpadder_icon.png"
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Tutorial"
          },
          {
            href: "https://github.com/Vexcited/lpadder",
            label: "GitHub",
            position: "right"
          },
          {
            type: "localeDropdown",
            position: "right"
          }
        ]
      },
      footer: {
        links: [
          { label: "github", to: "https://github.com/Vexcited/lpadder" },
          { label: "discord", to: "https://dsc.gg/lpadder" }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Vexcited & Trobonox`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
};

module.exports = config;
