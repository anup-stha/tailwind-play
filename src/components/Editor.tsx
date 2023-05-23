"use client";

import { Editor, useMonaco } from "@monaco-editor/react";
import {
  MonacoTailwindcss,
  configureMonacoTailwindcss,
  tailwindcssData,
} from "monaco-tailwindcss";
import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./Tabs";
import { TabsContent } from "@radix-ui/react-tabs";

const defaultTailwind = {
  theme: {
    extend: {
      screens: {
        television: "90000px",
      },
      spacing: {
        "128": "32rem",
      },
      colors: {
        lava: "#b5332e",
        ocean: {
          "50": "#f2fcff",
          "100": "#c1f2fe",
          "200": "#90e9ff",
          "300": "#5fdfff",
          "400": "#2ed5ff",
          "500": "#00cafc",
          "600": "#00a3cc",
          "700": "#007c9b",
          "800": "#00546a",
          "900": "#002d39",
        },
      },
    },
  },
};

const cssDefault = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}

@layer components {
  .btn-blue {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold font-bold py-2 px-4 rounded;
  }
}

@layer utilities {
  .filter-none {
    filter: none;
  }
  .filter-grayscale {
    filter: grayscale(100%);
  }
}

.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}

.select2-search {
  @apply border border-gray-300 rounded;
}

.select2-results__group {
  @apply text-lg font-bold text-gray-900;
}
`;

const htmlBody = `<!--
  Welcome to Tailwind Play, the official Tailwind CSS playground!

  Everything here works just like it does when you're running Tailwind locally
  with a real build pipeline. You can customize your config file, use features
  like  or even add third-party plugins.

  Feel free to play with this example if you're just learning, or trash it and
  start from scratch if you know enough to be dangerous. Have fun!
-->
<div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
  <img src="https://play.tailwindcss.com/img/beams.jpg" alt="" class="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" width="1308" />
  <div class="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
  <div class="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
    <div class="mx-auto max-w-md">
      <img src="https://play.tailwindcss.com/img/logo.svg" class="h-6" alt="Tailwind Play" />
      <div class="divide-y divide-gray-300/50">
        <div class="space-y-6 py-8 text-base leading-7 text-gray-600">
          <p>An advanced online playground for Tailwind CSS, including support for things like:</p>
          <ul class="space-y-4">
            <li class="flex items-center">
              <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="11" />
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
              </svg>
              <p class="ml-4">
                Customizing your
                <code class="text-sm font-bold text-gray-900">tailwind.config.js</code> file
              </p>
            </li>
            <li class="flex items-center">
              <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="11" />
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
              </svg>
              <p class="ml-4">
                Extracting classes with
                <code class="text-sm font-bold text-gray-900">@apply</code>
              </p>
            </li>
            <li class="flex items-center">
              <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="11" />
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
              </svg>
              <p class="ml-4">Code completion with instant preview</p>
            </li>
          </ul>
          <p>Perfect for learning how the framework works, prototyping a new idea, or creating a demo to share online.</p>
        </div>
        <div class="pt-8 text-base font-semibold leading-7">
          <p class="text-gray-900">Want to dig deeper into Tailwind?</p>
          <p>
            <a href="https://tailwindcss.com/docs" class="text-sky-500 hover:text-sky-600">Read the docs &rarr;</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
`;

export const EditorTailwind = () => {
  const [html, setHTML] = useState(htmlBody);
  const [css, setCSS] = useState(cssDefault);
  const [tailwindConfig, setTailwindConfig] = useState(defaultTailwind);

  const [output, setOutput] = useState("");

  const [monacoTailwindCSS, setMonacoTailwindCSS] =
    useState<MonacoTailwindcss>();

  useEffect(() => {
    window.MonacoEnvironment = {
      getWorker(moduleId, label) {
        switch (label) {
          case "editorWorkerService":
            return new Worker(
              new URL(
                "monaco-editor/esm/vs/editor/editor.worker",
                import.meta.url
              )
            );
          case "css":
          case "less":
          case "scss":
            return new Worker(
              new URL(
                "monaco-editor/esm/vs/language/css/css.worker",
                import.meta.url
              )
            );
          case "handlebars":
          case "html":
          case "razor":
            return new Worker(
              new URL(
                "monaco-editor/esm/vs/language/html/html.worker",
                import.meta.url
              )
            );
          case "json":
            return new Worker(
              new URL(
                "monaco-editor/esm/vs/language/json/json.worker",
                import.meta.url
              )
            );
          case "javascript":
          case "typescript":
            return new Worker(
              new URL(
                "monaco-editor/esm/vs/language/typescript/ts.worker",
                import.meta.url
              )
            );
          case "tailwindcss":
            return new Worker(
              new URL("monaco-tailwindcss/tailwindcss.worker", import.meta.url)
            );
          default:
            throw new Error(`Unknown label ${label}`);
        }
      },
    };
  }, []);

  const monaco = useMonaco();

  useEffect(() => {
    monaco?.languages.css.cssDefaults.setOptions({
      data: {
        dataProviders: {
          tailwindcssData,
        },
      },
    });
    if (monaco) {
      const monacoTailwindCSSCn = configureMonacoTailwindcss(monaco, {
        tailwindConfig,
      });

      setMonacoTailwindCSS(monacoTailwindCSSCn);
    }
  }, [monaco]);

  const generateOutput = useCallback(async () => {
    const content = await monacoTailwindCSS?.generateStylesFromContent(css, [
      {
        content: `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
        </head>
        <body>
        ${html}
        </body>
      </html>
      `,
        extension: ".html",
      },
    ]);
    if (content) {
      setOutput(content);
    }
  }, [css, html, monacoTailwindCSS]);

  useEffect(() => {
    generateOutput();
  }, [generateOutput, html]);

  return (
    <div className="flex w-full h-screen">
      <div className="w-[50vw]">
        <Tabs defaultValue="html">
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="config">Tailwind Config</TabsTrigger>
          </TabsList>
          <TabsContent value="html">
            <Editor
              height="100vh"
              defaultValue={html}
              language="html"
              onChange={(value) => {
                if (value) setHTML(value);
              }}
            />
          </TabsContent>
          <TabsContent value="css">
            <Editor
              height="100vh"
              defaultValue={css}
              language="css"
              onChange={(value) => {
                if (value) {
                  setCSS(value);
                }
              }}
            />
          </TabsContent>
          <TabsContent value="config">
            <Editor
              height="100vh"
              defaultValue={JSON.stringify(tailwindConfig, null, 2)}
              onChange={(value) => {
                if (value) {
                  monacoTailwindCSS?.setTailwindConfig(JSON.parse(value));
                  setTailwindConfig(JSON.parse(value));
                }
              }}
              language="json"
            />
          </TabsContent>
        </Tabs>
      </div>
      {output && (
        <div className="w-[50vw]">
          <div className="bg-white w-full h-[100vh] relative">
            <iframe
              className="absolute inset-0 w-full h-full bg-white"
              sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
              srcDoc={`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
    ${output}
    </style>
  </head>
  <body>
  ${html}
  </body>
</html>
`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorTailwind;
