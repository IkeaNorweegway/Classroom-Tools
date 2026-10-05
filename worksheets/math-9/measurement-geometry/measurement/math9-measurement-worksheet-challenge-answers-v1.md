# Surface Area and Volume — Challenge Worksheet Answer Key ★★
Grade 9 Mathematics · Teacher Copy — Not for Students

*Cover the answer. Try the question. Then check.*

**Format note:** Setup and decision step shown. Final answer listed. Full execution left to student to verify.

---

**1.** Error analysis

**(a) Cone V — student writes πr²h = 288π:**

> **Error named:** Forgot the (1/3) factor. The cone volume formula is V = **(1/3)πr²h**.
>
> **Setup:** V = (1/3)π(36)(8) = (1/3)(288π)
>
> **Final answer: V = 96π ≈ 301.59 cm³**

**(b) Cone SA — student uses h=10 instead of slant height:**

> **Error named:** Used the perpendicular height directly in the lateral surface formula. The formula πrl requires the **slant height l**, not the perpendicular height h.
>
> **Setup:** l = √(r²+h²) = √(9+100) = √109 ≈ 10.44 cm
>
> **Correct SA = π(3)(√109) + π(9) = (3√109+9)π ≈ 126.68 cm²**

**(c) Composite: sphere on cylinder — subtract 1 or 2 circles?**

> **One circle is correct.** When a sphere rests on the flat top of a cylinder, the flat top circle of the cylinder is hidden (not exposed). However, the sphere has no flat face — it's curved — so there is no flat area to remove from the sphere. Only **one** circle area is subtracted, from the cylinder's SA. The second student is wrong.

---

**2.** Scaling a sphere

**(a) Original sphere r:**

> **SA = 4πr²** | **V = (4/3)πr³**

**(b) Doubled to 2r:**

> **SA = 4π(2r)² = 16πr²** | **V = (4/3)π(2r)³ = (32/3)πr³**

**(c) Factors:**

> **SA ratio = 16πr²/4πr² = 4** (SA multiplied by 4)
> **V ratio = (32/3)πr³ / (4/3)πr³ = 8** (V multiplied by 8)

**(d) Why volume grows faster:**

> SA depends on r² (2 dimensions); V depends on r³ (3 dimensions). When radius doubles, SA grows by 2² = 4 and V grows by 2³ = 8. Volume always grows faster than surface area when scaling uniformly — this is why large animals have proportionally less skin per unit mass than small ones.

---

**3.** Alberta oil tank — r=8, h=15

**(a) Volume:**

> **Setup:** V = π(64)(15) = 960π
>
> **Volume = 960π ≈ 3015.93 m³ ≈ 3,015,930 L**

**(b) Hemispherical dome cap (r=8) — additional volume:**

> **Setup:** V_hemisphere = (2/3)πr³ = (2/3)π(512) = (1024/3)π
>
> **Additional volume ≈ 1072.33 m³**

**(c) Painted surfaces:**

> - Cylinder bottom (circular base): **64π m²** ✓ painted
> - Cylinder lateral: **2π(8)(15) = 240π m²** ✓ painted
> - Cylinder top: hidden (hemisphere sits on it) ✗
> - Hemisphere curved exterior: **2π(64) = 128π m²** ✓ painted
>
> **Total painted area = (64+240+128)π = 432π ≈ 1357.17 m²**

**(d) Paint cost at $12/m²:**

> **Cost = 432π × 12 = 5184π ≈ $16,286**

---

**4.** Toy rocket — cylinder (r=2, h=8) + cone (r=2, h=3) + hemisphere base

Cone slant: l = √(4+9) = √13 ≈ 3.61 cm

**(a) Total volume:**

> V_cylinder = π(4)(8) = 32π
> V_cone = (1/3)π(4)(3) = 4π
>
> **Total V = 36π ≈ 113.10 cm³**

**(b) Exterior surfaces — list and calculate:**

> - Hemisphere curved (concave base, exposed exterior): **2π(4) = 8π cm²**
> - Cylinder lateral: **2π(2)(8) = 32π cm²**
> - Cylinder top: **hidden** (cone sits on it)
> - Cone base: **hidden** (flush against cylinder top)
> - Cone lateral: **π(2)(√13) = 2π√13 cm²**
>
> **Total SA = (40 + 2√13)π ≈ 147.80 cm²**

**(c) Cone base in SA:**

> **No** — the cone's base is flush against the cylinder's top face. Both are hidden at the junction. Neither appears in the outer surface area.

---

**5.** Cones and cylinders — the one-third relationship

**(a) Algebraic proof:**

> 3 × V_cone = 3 × (1/3)πr²h = πr²h = V_cylinder ✓
>
> Three identical cones with the same base and height as the cylinder fill it exactly.

**(b) Intuitive explanation:**

> A cone starts with the full cross-section at the base but tapers linearly to zero at the apex. At any height y, the cross-section is smaller than the full base. Averaged over the entire height, a cone fills exactly ⅓ of the volume that a cylinder with the same base and height would hold. The linear taper produces the ⅓ factor through integration (though this can also be shown physically by pouring).

---

**6.** Optimization — V=500 cm³

**(a) r=4 — find h:**

> π(16)h = 500 → h = 500/(16π) ≈ **9.95 cm**

**(b) r=5 — find h:**

> π(25)h = 500 → h = 500/(25π) ≈ **6.37 cm**

**(c) SA comparison:**

> SA(r=4) = 2π(16)+2π(4)(9.95) = 32π+79.6π ≈ 111.6π ≈ **350.5 cm²**
> SA(r=5) = 2π(25)+2π(5)(6.37) = 50π+63.7π ≈ 113.7π ≈ **357.1 cm²**
>
> **r=4 uses slightly less material.**

**(d) Why minimize SA?**

> Less material = lower manufacturing cost and less waste. For same volume, a can with smaller SA is cheaper to produce. (The optimal ratio for minimum SA of a cylinder is h = 2r — height equals diameter.)

---

**7.** Sphere inside cylinder

**(a) Cylinder dimensions:**

> Radius = **r** (same as sphere) | Height = **2r** (sphere diameter)

**(b) V_sphere = ⅔ V_cylinder:**

> V_sphere = (4/3)πr³
> V_cylinder = πr²(2r) = 2πr³
>
> Ratio = (4/3)πr³ / 2πr³ = (4/3)/2 = **2/3** ✓

**(c) SA_sphere = ⅔ SA_cylinder:**

> SA_sphere = 4πr²
> SA_cylinder = 2πr²+2πr(2r) = 2πr²+4πr² = 6πr²
>
> Ratio = 4πr²/6πr² = **2/3** ✓
>
> A sphere is more "efficient" than any cylinder — maximum volume for minimum surface area.
