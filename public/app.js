(() => {
  document.getElementById("year").textContent = new Date().getFullYear();
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const runningAnimations = new Set();
  const animate = (element, keyframes, options) => {
    if (!element || motionPreference.matches || !element.animate) return;
    const animation = element.animate(keyframes, options);
    runningAnimations.add(animation);
    animation.finished.then(
      () => runningAnimations.delete(animation),
      () => runningAnimations.delete(animation),
    );
  };
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches)
      runningAnimations.forEach((animation) => animation.cancel());
  });
  const menu = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("navigation");
  const closeMenu = () => {
    navigation.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open menu");
    menu.textContent = "Menu";
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.textContent = open ? "Close" : "Menu";
    if (open)
      animate(
        navigation,
        [
          { opacity: 0, transform: "translateY(-4px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 180, easing: "ease-out" },
      );
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const activateTab = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute("aria-controls"));
      panel.getAnimations().forEach((animation) => animation.cancel());
      panel.hidden = !active;
      if (active)
        animate(
          panel,
          [
            { opacity: 0.35, transform: "translateY(5px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 220, easing: "ease-out" },
        );
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activateTab(tabs[next]);
        tabs[next].focus();
      }
    });
  });
  // Keep all content visible by default. Motion is progressive enhancement.
  if ("IntersectionObserver" in window && !motionPreference.matches) {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal.unobserve(entry.target);
          animate(
            entry.target,
            [
              { opacity: 0.3, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 620, easing: "cubic-bezier(.2,.7,.2,1)" },
          );
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(
        ".section-intro, .product-feature, .formats-row, .studio-copy, .studio-story, .founder-identity, .founder-story, .closing-section, .footer-top",
      )
      .forEach((element) => reveal.observe(element));
    const documentMotion = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          documentMotion.unobserve(entry.target);
          animate(
            entry.target.querySelector(".source-card"),
            [
              { opacity: 0.4, transform: "translateY(12px) rotate(-5deg)" },
              { opacity: 1, transform: "translateY(0) rotate(-5deg)" },
            ],
            { duration: 780, easing: "cubic-bezier(.2,.7,.2,1)" },
          );
          animate(
            entry.target.querySelector(".chunk-card"),
            [
              { opacity: 0.3, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 780,
              delay: 140,
              easing: "cubic-bezier(.2,.7,.2,1)",
              fill: "backwards",
            },
          );
          animate(
            entry.target.querySelector(".export-chip"),
            [
              { opacity: 0.3, transform: "translateY(12px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 660,
              delay: 360,
              easing: "cubic-bezier(.2,.7,.2,1)",
              fill: "backwards",
            },
          );
          entry.target
            .querySelectorAll(".chunk-lines b")
            .forEach((line, index) => {
              animate(
                line,
                [{ transform: "scaleX(.2)" }, { transform: "scaleX(1)" }],
                {
                  duration: 620,
                  delay: 240 + index * 70,
                  easing: "ease-out",
                  fill: "backwards",
                },
              );
            });
        });
      },
      { threshold: 0.25 },
    );
    document
      .querySelectorAll(".hero-art")
      .forEach((element) => documentMotion.observe(element));
  }
  document.querySelector(".download-example").addEventListener("click", () => {
    const example = {
      document: "recovery-guide.md",
      example: true,
      chunks: [
        {
          id: "chunk_01",
          source: "section_01",
          title: "Recovery guide",
          text: "Steps for restoring the database safely.",
        },
        {
          id: "chunk_02",
          source: "section_02",
          title: "Prerequisites",
          text: "Confirm access and a recent backup.",
        },
        {
          id: "chunk_03",
          source: "section_03",
          title: "Recovery procedure",
          text: "Check replication status. Verify available disk space. Restore using the approved playbook. Replication lag: 30 seconds. Free disk space: 20%.",
        },
      ],
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(example, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "rainc-example.json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
