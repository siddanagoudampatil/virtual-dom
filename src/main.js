import createElement from "./v-dom/createElement";
import render from "./v-dom/render";
import mount from "./v-dom/mount";
import diff from "./v-dom/diff";

const createApp = (count) => {
  const app = createElement("div", {
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      `Current Count: ${count}`,
      createElement("div", {
        children: [
          ...Array.from({ length: count }, () =>
            createElement("img", {
              attrs: {
                src: "https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif",
                width: "120",
                border: "5px",
              },
            }),
          ),
        ],
      }),
    ],
  });

  return app;
};

let app = createApp(0);
let root = mount(render(app), document.getElementById("app"));

setInterval(() => {
  const n = Math.floor(Math.random() * 10);
  const newApp = createApp(n);
  const patch = diff(app, newApp);
  patch(root);
  app = newApp;
}, 1000);
