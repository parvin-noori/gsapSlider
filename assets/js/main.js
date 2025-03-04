$(document).ready(function () {
  const eraProjects = $(".era-projects");
  const eraHeight = $(".era-height");
  const eraProjectss = gsap.utils.toArray(".project");
  let gap = 30;
  let itemWidth;

  const minScale = 0.65;
  const maxScale = 0.75;
  const itemImgWidth = 350;
  const activeItemImgWidth = 699;
  const activeItemHeight = 700;
  const itemTxtWidth = 290;

  eraProjectss.forEach((item, index) => {
    let itemImgs = $(item).find(".project-img");
    let itemText = $(item).find(".project-text");

    // ====================
    // config inital style
    // ======================
    gsap.set(itemImgs, {
      width: `${itemImgWidth}px`,
    });
    gsap.set(itemText, {
      width: `${itemTxtWidth}px`,
    });

    // itemWidth = itemImgs.width() + itemText.width();
  });

  gsap.set(eraProjects, {
    scale: maxScale,
    transformOrigin: "center 253px 0px",
    width: `${itemImgWidth}px`,
  });

  setTimeout(() => {
    configItemHeight(false);
  }, 10);

  function itemHeight(item, isPaused = true) {
    const currentItem = $(item);
    const hero = currentItem.find(".project-img");
    const projectContent = currentItem.find(".project-content");
    let slides = projectContent.children().not(".hero.project-img");

    let tl = gsap.timeline({ paused: isPaused });

    tl.to(hero, {
      width: activeItemImgWidth,
      transformOrigin: "center",
    });
    tl.to(
      projectContent,
      {
        height: activeItemHeight,
        transformOrigin: "center",
      },
      "-=1"
    )
      .to(
        item,
        {
          xPercent: -20,
        },
        "-=1"
      )
      .fromTo(
        slides,
        {
          xPercent: 50,
          display: "none",
        },
        {
          xPercent: 0,
          display: "block",
          delay: 1,
        }
      );

    return tl;
  }

  function configItemHeight() {
    let previousHeight = 0;
    let totalHeight = 0;

    eraProjectss.forEach((item, index) => {
      const currentItem = $(item);
      let currentHeight = index === 0 ? 0 : previousHeight;

      if (!currentItem.hasClass("active")) {
        gsap.set(item, { y: currentHeight });
      } else {
        const hero = currentItem.find(".project-img");
        const originalWidth = hero.width(); // original
        hero.css("width", activeItemImgWidth);
        const newHeight = currentItem.outerHeight(true);
        hero.css("width", originalWidth);

        itemHeight(item, false);
        previousHeight += newHeight + gap;
        totalHeight += newHeight;
      }

      if (!currentItem.hasClass("active")) {
        const itemHeight = currentItem.outerHeight(true);
        previousHeight += itemHeight + gap;
        totalHeight += itemHeight;
      }

      if (index === eraProjectss.length - 1) {
        gsap.set(eraHeight, { height: totalHeight });
      }
    });
  }

  // ====================
  // scale timeline
  // ====================
  let tl = gsap.timeline({ paused: true });

  tl.to(eraProjects, {
    scale: minScale,
    transformOrigin: "center 253px",
    ease: "power1.in",
    duration: 2,
  });

  // Track scroll position
  let lastScrollTop = 0;
  let isScrolling;

  $(window).scroll(function () {
    let currentScrollTop = $(this).scrollTop();

    // Play the animation on scroll
    tl.play();

    // Detect when the user stops scrolling and reverse the animation
    clearTimeout(isScrolling);
    isScrolling = setTimeout(function () {
      tl.reverse();
    }, 150);

    lastScrollTop = currentScrollTop;
  });

  // ====================
  // create horiz slider
  // ====================

  let heroImg = gsap.utils.toArray(".project-img.hero");
  let projectItems = gsap.utils.toArray(
    ".project-content > *:not(:first-child)"
  );

  $(heroImg).click(function (event) {
    event.stopPropagation();
    handleProjectClick(this);
  });

  function handleProjectClick(heroImg) {
    let uniqprojectSlides = $(heroImg)
      .parent()
      .children()
      .not(".hero.project-img");
    let uniqproject = $(heroImg).closest(".project");
    let uniqprojectContent = $(heroImg).parent();

    if (!uniqproject.hasClass("active")) {
      // disable all horiz slider
      // createHorizSlider(projectItems);
      // resetDragableSlider(eraProjectss);
      // projectInfoAnimate($(eraProjectss), true);
      $(eraProjectss).removeClass("active");

      // enable uniq project
      uniqproject.addClass("active");
      configItemHeight();
      // createHorizSlider(uniqprojectSlides, false);
      // projectInfoAnimate(uniqproject, false);
    }

    setTimeout(() => {
      itemWidth = $(".project-content").width();
      drageHorizSlider(uniqproject);
    }, 10);
  }

  // create horiz slider
  function createHorizSlider(slides, isPaused = true) {
    let tlSlider = gsap.timeline({ paused: isPaused });
    tlSlider.fromTo(
      slides,
      {
        xPercent: 50,
        display: "none",
      },
      {
        xPercent: 0,
        display: "block",
        delay: 1,
      }
    );

    return tlSlider;
  }

  // project info animate
  function projectInfoAnimate(uniqproject, isPaused = true) {
    let additionalInfo = uniqproject.find(".additional-info");
    let socialNetworks = uniqproject.find(".social-networks");

    let tl = gsap.timeline({ paused: isPaused });

    tl.fromTo(
      [additionalInfo, socialNetworks],
      {
        opacity: 0,
        xPercent: -50,
        stagger: 0,
      },
      {
        opacity: 1,
        xPercent: 0,
      }
    );

    return tl;
  }

  projectInfoAnimate($(eraProjectss));

  createHorizSlider(projectItems);

  // ====================
  // draggable feature
  // ====================

  gsap.registerPlugin(Draggable);

  function drageHorizSlider(uniqproject) {
    let slides = uniqproject.children();
    let currentSlide = 0;
    let snapPoints = Array.from(slides).map((slide) => {
      slide.offsetLeft;
    });

    let getSlideIndexAt = (x) =>
      snapPoints.indexOf(gsap.utils.snap(snapPoints, x));

    Draggable.create(uniqproject, {
      bounds: { minX: 0, maxX: -itemWidth },
      type: "x",
      onDragEnd() {
        updateSlide(this.endX);
      },
      inertia: true,
      snap: {
        x: (value) => gsap.utils.snap(snapPoints, value),
      },
    })[0];

    function updateSlide(x) {
      const newSlide = getSlideIndexAt(x);
      if (newSlide !== currentSlide) {
        currentSlide = newSlide;
      }
    }
  }

  // Reset or reverse the slider to the first slide position
  function resetDragableSlider(uniqproject) {
    gsap.to(uniqproject, { x: 0, duration: 0.5 });
    currentSlide = 0;
  }
});
