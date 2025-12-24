---
title: "How React Principles Solved My React Native Animation Nightmare"
description: "A story of migrating react-native-reanimated from v1 to v3, shipping with P0 UX bugs, and how understanding React's component lifecycle and key prop finally fixed everything."
slug: "react-principles-solved-animation-nightmare"
publishedAt: 2025-11-10
tags:
  - react-native
  - react-native-reanimated
  - react
  - animation
  - engineering
---

## Historical Context

In the company & product I work with, we had a feature revamp last year Jan in which we were using react-native-reanimated v1.X (which is ancient, as per Software Mansion docs).

You can think of this as "Instagram Story meets Instagram Reel who meets a product team who understands neither".

![UI](https://shtosan.wordpress.com/wp-content/uploads/2025/11/4231aaf8-39b5-41a1-ab89-97a6164da204-78040-00000963d5dfabb4_file.jpg)

## User Interaction Possibilities

![User Interaction Possibilities](https://shtosan.wordpress.com/wp-content/uploads/2025/11/92c4a08a-2351-4c0d-a918-d1a5ed5c6903-78040-00000965e6db43c1_file.jpg)

### Clicks/presses

- **Tap Gesture** → takes user to next part of the story (if multi-part story) or takes user to next story
- **Pan Gesture** → takes user to next story
- **Long Press Gesture** → hold: pause story & release: play story

## Animation Requirements

When story is playing, the progress bar must animate from `width: 0` to `width: N` (calculated).

When story is paused, the progress bar must stop the animation & when the story is played again, it must continue from that point.

## Issues

Whenever the story is paused, the progress bar used to be reset to 0.

This is because we started with react-native-reanimated v1.X & we had to bump up to react-native-reanimated v3.X in 48h without regression. So I had taken a decision to "just make it work" even with P0 UX issues 😦

## The Root Cause

```tsx
const useProgressBarAnimation = (
  animationConfig: {
    enabled: boolean;
    duration: number;
    onAnimationEnd: () => void;
  },
  deps: Array<unknown>,
) => {
  const progressBarWidth = useSharedValue<number>(0);

  useEffect(() => {
    if (props.animationConfig.enabled) {
      const onAnimationEndCallback = () => {
        cancelAnimation(progressBarWidth);
        progressBarWidth = withTiming(0, { duration: 0 });
        props.onAnimationEnd();
      };
      progressBarWidth = withTiming(
        1,
        { duration: props.animationDuration },
        (hasAnimationFinished) => {
          if (hasAnimationFinished) {
            runOnJS(onAnimationEndCallback)();
          }
        },
      );

      return () => {
        cancelAnimation(progressBarWidth);
        progressBarWidth = withTiming(0, { duration: 0 });
      };
    }
  }, [props.animationConfig.enabled, ...props.deps]);
};

// Hook usage
const progressBarAnimVal = useProgressBarAnimation(
  {
    enabled:
      id && storyPlayingStatus === "playing" && mediaLoadedAtTimestamp !== null,
    duration: storyDuration,
  },
  [id],
);

return (
  <ProgressBar animVal={progressBarAnimVal} onAnimationEnd={onAnimationEnd} />
);
```

Minimal repro code gist: [https://gist.github.com/onstash/e341c564cfd4c53189fd0b1240594cbb](https://gist.github.com/onstash/e341c564cfd4c53189fd0b1240594cbb)

The hook `useProgressBarAnimation` is used in the parent of `ProgressBar` component and it never gets unmounted and handling pause state requires a LOT of hacks.

## Solution

```tsx
function ProgressBar(props: {
  animate: boolean;
  onAnimationEnd: () => {};
  onAnimationPause: (percentRemaining: number) => {};
}) {
  const progressBarWidth = useSharedValue<number>(0);

  useEffect(() => {
    if (props.animate) {
      progressBarWidth = withTiming(
        1,
        { duration: props.animationDuration },
        (hasAnimationFinished) => {
          if (hasAnimationFinished) {
            runOnJS(props.onAnimationEnd)();
          }
        },
      );

      return () => {
        // This means props.animate has become false
        cancelAnimation(progressBarWidth);
        props.onAnimationPause(1 - progressBarWidth.value);
      };
    }
  }, [props.animate]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        progressBarWidth.value,
        [0, 1],
        [0, progressBarMaxWidth],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <REAnimated.View
      style={(styles.progressBarContainer, { width: progressBarMaxWidth })}
    >
      <REAnimated.View
        style={(styles.progressBar, animatedStyle)}
      ></REAnimated.View>
    </REAnimated.View>
  );
}

<ProgressBar
  key={id}
  animationDuration={storyDuration}
  animate={storyPlayingStatus === "playing" && mediaLoadedAtTimestamp !== null}
  onAnimationEnd={onAnimationEnd}
  onAnimationPause={onAnimationPause}
/>;
```

Minimal repro code gist: [https://gist.github.com/onstash/f0d2c8ad95c70638f5ca2ea9e288c448](https://gist.github.com/onstash/f0d2c8ad95c70638f5ca2ea9e288c448)

When we defined the `progressBarWidth: SharedValue<number>` inside the `ProgressBar` component with an `animate: boolean` prop which is derived from state variables, `onAnimationPause()` logic to recalculate the animation duration based on progress % & the **key** ingredient, the `ProgressBar` can now work seamlessly as expected.

## Why?

Because whenever the story `id` changes, the `key` for `ProgressBar` also changes, so the state is reset.

And when user pauses the story, `props.animate` is `false` so `useEffect` cleanup is run with the animation cancelled & `onAnimationPaused()` called. So the next time the story is played, the duration is the pending duration, not the total duration.
