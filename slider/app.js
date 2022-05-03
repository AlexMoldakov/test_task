const drawDots = (count) => {
    for (let i = 0; i < count; i++) {
        const dotElement = document.createElement('button')
        dotElement.addEventListener("click", () => changeCurrentSlide(i))
        dotElement.className = `dot dot-${i}`;
        dotsContainer.appendChild(dotElement);
    }
}

const updateActiveDot = (newActiveDotIndex) => {
    const dots = document.querySelectorAll(".dot")

    dots.forEach((dot, index) => {
        if (index === newActiveDotIndex) {
            dot.classList.add("active-dot");
        } else {
            dot.classList.remove("active-dot");
        }
    });

}

const toggleButtonsDisable = (newDisavledState) => {
    const dots = document.querySelectorAll(".dot")

    dots.forEach(dot => {
        dot.disabled = newDisavledState;
    });

    navButtons.forEach(button => {
        button.disabled = newDisavledState;
    });

    isDisabled = newDisavledState
}

const changeCurrentSlide = (newCurrentSlideIndex) => {
    const newPosition = newCurrentSlideIndex * slideWidth;
    animateSlideMove(currentPosition, newPosition);
    currentSlideIndex = newCurrentSlideIndex
    updateActiveDot(currentSlideIndex);

}


const updateSliderLine = (position) => {
    sliderLine.style.left = `${-position}px`
}

const animateSlideMove = (position, newPosition) => new Promise((resolve) => {
    const animationStep = (Math.abs(position - newPosition) / 100) * 5 * (position < newPosition ? 1 : -1);
    const animationInterval = 20;
    let animatePosition = position;

    toggleButtonsDisable(true);

    const interval = setInterval(() => {
        updateSliderLine(animatePosition);

        if (animatePosition == newPosition) {

            toggleButtonsDisable(false);
            clearInterval(interval)
            currentPosition = newPosition;
            resolve()

        } else {
            animatePosition += animationStep
        }
    }, animationInterval);
})

const showNextSlide = () => {
    const newPosition = currentPosition + slideWidth;

    if (newPosition < sliderLineWidth) {
        animateSlideMove(currentPosition, newPosition);
        ++currentSlideIndex;
        updateActiveDot(currentSlideIndex)
    } else {
        updateSliderLine(startPosition - slideWidth);

        const lastSlideClone = lastSlide.cloneNode(true);
        lastSlideClone.className = "slide slide-ghost";
        sliderLine.prepend(lastSlideClone)

        animateSlideMove(-slideWidth, startPosition).then(() => {
            sliderLine.removeChild(lastSlideClone)
            currentSlideIndex = 0
            updateActiveDot(currentSlideIndex)
        })
    }
}

const showPrevSlide = () => {
    const newPosition = currentPosition - slideWidth;

    if (newPosition >= startPosition) {
        animateSlideMove(currentPosition, newPosition);
        --currentSlideIndex;
        updateActiveDot(currentSlideIndex)
    } else {
        updateSliderLine(sliderLineWidth);

        const firstSlideClone = firstSlide.cloneNode(true);
        sliderLine.append(firstSlideClone)

        animateSlideMove(sliderLineWidth, sliderLineWidth - slideWidth).then(() => {
            sliderLine.removeChild(firstSlideClone)
            currentSlideIndex = slideCount - 1
            updateActiveDot(currentSlideIndex)
        })
    }


}


const sliderLine = document.getElementById('slider-line');
const slideList = document.querySelectorAll(".slide")
const dotsContainer = document.getElementById("dots-container")
const navButtons = document.querySelectorAll(".nav-button")
const navButtonPrev = document.getElementById("button-prev")
const navButtonNext = document.getElementById("button-next")

const slideCount = slideList.length
const lastSlide = slideList[slideCount - 1]
const firstSlide = slideList[0]
const slideWidth = 200;
const sliderLineWidth = slideCount * slideWidth;
const startPosition = 0;
let currentPosition = startPosition;
let isDisabled = false;
let currentSlideIndex = 0;

navButtonNext.addEventListener("click", showNextSlide)
navButtonPrev.addEventListener("click", showPrevSlide)

drawDots(slideCount);
updateActiveDot(currentSlideIndex);