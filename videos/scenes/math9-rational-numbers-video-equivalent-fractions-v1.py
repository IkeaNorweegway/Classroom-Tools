"""Manim scene for math9-rational-numbers-video-equivalent-fractions-v1.

Auto-generated scaffold by scripts/render_video_script.py from video-scripts/math-9/rational-numbers/math9-rational-numbers-video-equivalent-fractions-v1.md.
This file is written ONCE and never overwritten by a later pipeline run — fill in the
`# TODO: self.play(...)` markers below with real animation code. Re-running the
pipeline after a text edit only regenerates narration audio and beats.json, not this
file. If you need a clean scaffold again, delete this file first.
"""

from manim import *

AMBER = ManimColor("#FFBF00")
BAR_W = 5.0
BAR_H = 1.1


def bar_lines(center, width, height, n_pieces, color):
    """Internal vertical divider lines for a bar split into n_pieces equal pieces."""
    lines = VGroup()
    for i in range(1, n_pieces):
        x = center[0] - width / 2 + width * i / n_pieces
        lines.add(Line([x, center[1] - height / 2, 0], [x, center[1] + height / 2, 0], color=color, stroke_width=4))
    return lines


class ExplainerScene(Scene):
    def construct(self):
        self.beat_00_cold_open_the_visual_puzzle()
        self.beat_01_the_cut_doesn_t_touch_the_amount()
        self.beat_02_recount_same_picture_new_fraction_name()
        self.beat_03_do_it_again_the_pattern_appears()
        self.beat_04_generalize()
        self.beat_05_recap_closing_beat()

    def beat_00_cold_open_the_visual_puzzle(self):
        """ANIMATE: Two identical rectangles (light gray outline) side by side. Left: split into 2 equal
        pieces, left piece shaded blue. Right: split into 4 equal pieces, two left-most pieces shaded blue.
        Both shaded regions occupy the exact same physical area of the bar.
        ON-SCREEN TEXT: `1/2` under the left bar, `2/4` under the right bar
        """
        self.add_sound(
            "/home/ejanbremness/Documents/Classroom tools/videos/cache/math9-rational-numbers-video-equivalent-fractions-v1/beat_00_cold_open_the_visual_puzzle.wav"
        )

        left_center = np.array([-3.2, 0.3, 0])
        right_center = np.array([3.2, 0.3, 0])

        self.left_outline = Rectangle(width=BAR_W, height=BAR_H, color=GRAY_B, stroke_width=3).move_to(left_center)
        self.left_blue = Rectangle(width=BAR_W / 2, height=BAR_H, color=BLUE, fill_color=BLUE, fill_opacity=0.85, stroke_width=0)
        self.left_blue.align_to(self.left_outline, LEFT).align_to(self.left_outline, UP)
        self.left_label = Text("1/2", font_size=40).next_to(self.left_outline, DOWN, buff=0.35)

        self.right_outline = Rectangle(width=BAR_W, height=BAR_H, color=GRAY_B, stroke_width=3).move_to(right_center)
        self.right_blue = Rectangle(width=BAR_W / 2, height=BAR_H, color=BLUE, fill_color=BLUE, fill_opacity=0.85, stroke_width=0)
        self.right_blue.align_to(self.right_outline, LEFT).align_to(self.right_outline, UP)
        self.right_given_lines = bar_lines(right_center, BAR_W, BAR_H, 4, GRAY_B)
        self.right_label = Text("2/4", font_size=40).next_to(self.right_outline, DOWN, buff=0.35)

        self.play(Create(self.left_outline), Create(self.right_outline), run_time=1.0)
        self.play(FadeIn(self.left_blue), FadeIn(self.right_blue), run_time=0.8)
        self.play(Create(self.right_given_lines, lag_ratio=0), run_time=1.0)
        self.play(Write(self.left_label), Write(self.right_label), run_time=1.2)
        self.wait(4.7)

    def beat_01_the_cut_doesn_t_touch_the_amount(self):
        """ANIMATE: Left bar (still 1/2, blue shaded left half): an amber vertical line draws itself through
        the middle of both the shaded and unshaded piece, splitting each in two. The blue shaded region does
        not move, resize, or recolor — it simply now has amber lines running through it.
        ON-SCREEN TEXT: none
        """
        self.add_sound(
            "/home/ejanbremness/Documents/Classroom tools/videos/cache/math9-rational-numbers-video-equivalent-fractions-v1/beat_01_the_cut_doesn_t_touch_the_amount.wav"
        )

        left_center = self.left_outline.get_center()
        self.left_new_lines = bar_lines(left_center, BAR_W, BAR_H, 4, AMBER)
        # only the two NEW cuts (the pre-existing half-boundary is the blue/white edge itself)
        new_cuts = VGroup(self.left_new_lines[0], self.left_new_lines[2])

        self.play(Create(new_cuts, lag_ratio=0), run_time=1.5)
        self.play(Indicate(self.left_blue, color=BLUE), run_time=1.5)
        self.wait(6.3)

    def beat_02_recount_same_picture_new_fraction_name(self):
        """ANIMATE: The now-4-piece left bar morphs/aligns to sit directly on top of the right bar from the
        cold open. The two bars visually merge into one — same blue shaded area, same amber partition lines.
        ON-SCREEN TEXT: `1/2 = 2/4`
        """
        self.add_sound(
            "/home/ejanbremness/Documents/Classroom tools/videos/cache/math9-rational-numbers-video-equivalent-fractions-v1/beat_02_recount_same_picture_new_fraction_name.wav"
        )

        left_group = VGroup(self.left_outline, self.left_blue, self.left_new_lines[0], self.left_new_lines[2])
        target_center = self.right_outline.get_center()

        self.play(left_group.animate.move_to(target_center), run_time=2.0)
        self.play(
            FadeOut(self.right_outline),
            FadeOut(self.right_blue),
            FadeOut(self.right_given_lines),
            FadeOut(self.right_label),
            run_time=1.0,
        )
        new_label = Text("1/2 = 2/4", font_size=40).move_to(self.left_label)
        self.play(Transform(self.left_label, new_label), run_time=1.5)
        self.wait(6.3)

    def beat_03_do_it_again_the_pattern_appears(self):
        """ANIMATE: The same bar: amber lines draw in, splitting each of the 4 existing pieces into 3 (12
        pieces total), with the originally-shaded region now covered by 6 small amber-outlined pieces, still
        shaded entirely blue.
        ON-SCREEN TEXT: `1/2 = 2/4 = 6/12`
        """
        self.add_sound(
            "/home/ejanbremness/Documents/Classroom tools/videos/cache/math9-rational-numbers-video-equivalent-fractions-v1/beat_03_do_it_again_the_pattern_appears.wav"
        )

        center = self.left_outline.get_center()
        fine_lines = bar_lines(center, BAR_W, BAR_H, 12, AMBER)
        # skip the 3 lines that coincide with the existing 4-piece boundaries (every 3rd of the 11 new lines)
        existing_x = {round(float(self.left_new_lines[0].get_center()[0]), 2), round(float(self.left_new_lines[2].get_center()[0]), 2)}
        new_fine_lines = VGroup(*[ln for ln in fine_lines if round(float(ln.get_center()[0]), 2) not in existing_x])

        self.play(Create(new_fine_lines, lag_ratio=0), run_time=2.0)
        new_label = Text("1/2 = 2/4 = 6/12", font_size=40).move_to(self.left_label)
        self.play(Transform(self.left_label, new_label), run_time=1.5)
        self.wait(3.4)

    def beat_04_generalize(self):
        """ANIMATE: The fraction equation `1/2 = 2/4 = 6/12` morphs into the general form
        `a/b = (a × n)/(b × n)`, with the ×n multiplier highlighted in the same amber used for every cut
        line in the video.
        ON-SCREEN TEXT: `a/b = (a × n)/(b × n)`
        """
        self.add_sound(
            "/home/ejanbremness/Documents/Classroom tools/videos/cache/math9-rational-numbers-video-equivalent-fractions-v1/beat_04_generalize.wav"
        )

        left_part = Text("a/b =", font_size=40)
        right_part = Text("(a×n)/(b×n)", font_size=40, color=AMBER)
        general_eq = VGroup(left_part, right_part).arrange(RIGHT, buff=0.3)
        general_eq.move_to(self.left_label)
        self.play(ReplacementTransform(self.left_label, general_eq), run_time=2.5)
        self.wait(1.5)
        self.play(Circumscribe(right_part, color=AMBER), run_time=2.0)
        self.wait(2.0)
        self.play(Indicate(right_part, color=AMBER), run_time=1.5)
        self.general_eq = general_eq
        self.wait(10.9)

    def beat_05_recap_closing_beat(self):
        """ANIMATE: Final frame: the one fully-partitioned bar (12 pieces, 6 shaded blue) with all three
        equivalent fraction names stacked beside it, held static.
        ON-SCREEN TEXT: `1/2 = 2/4 = 6/12`
        """
        self.add_sound(
            "/home/ejanbremness/Documents/Classroom tools/videos/cache/math9-rational-numbers-video-equivalent-fractions-v1/beat_05_recap_closing_beat.wav"
        )

        final_label = Text("1/2 = 2/4 = 6/12", font_size=40).move_to(self.left_label)
        self.play(ReplacementTransform(self.general_eq, final_label), run_time=1.5)
        self.play(Indicate(self.left_outline), Indicate(self.left_blue), run_time=1.5)
        self.wait(8.2)

