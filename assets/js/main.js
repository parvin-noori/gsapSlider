$(document).ready(function () {
  const eraProjects = $(".era-projects");
  const eraHeight = $(".era-height");
  const eraProjectss = gsap.utils.toArray(".project");
  let previousHeight = 0;
  let gap = 30;
  let totalHeight = 0;
  let itemWidth;

  const minScale = 0.65;
  const maxScale = 0.75;

  eraProjectss.forEach((item, index) => {
    let currentHeight = index === 0 ? 0 : previousHeight;
    let itemImgs = $(item).find(".project-img");
    let itemText = $(item).find(".project-text");

    // ====================
    // config inital style
    // ======================
    gsap.set(itemImgs, {
      width: "699px",
    });
    gsap.set(itemText, {
      width: "290px",
    });

    gsap.set(item, {
      y: currentHeight,
    });

    previousHeight = $(item).height() + gap;

    totalHeight += $(item).height();

    if (index === eraProjectss.length - 1) {
      gsap.set(eraHeight, {
        height: totalHeight,
      });
    }

    // itemWidth = itemImgs.width() + itemText.width();
  });

  gsap.set(eraProjects, {
    scale: maxScale,
    transformOrigin: "center 253px 0px",
    width: "699px",
  });

  // ====================
  // scale timeline
  // ====================
  let tl = gsap.timeline({ paused: true });

  tl.to(eraProjects, {
    scale: minScale,
    transformOrigin: "center 253px",
    ease: "power4.in",
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

  $(heroImg).click(function () {
    let uniqprojectSlides = $(this)
      .parent()
      .children()
      .not(".hero.project-img");
    let uniqproject = $(this).closest(".project");

    // disable all horiz slider
    createHorizSlider(projectItems);
    resetDragableSlider(eraProjectss);
    projectInfoAnimate($(eraProjectss),true);

    // enable uniq project
    createHorizSlider(uniqprojectSlides, false);
    projectInfoAnimate(uniqproject,false);

    setTimeout(() => {
      itemWidth = $(".project-content").width();
      drageHorizSlider(uniqproject);
    }, 10);
  });


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
