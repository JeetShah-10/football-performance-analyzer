# ADR-001: Gaussian Mixture Models (GMM) with Soft Probabilities for Tactical Versatility

## Status
Accepted

## Date
2026-08-25

## Context
Traditional football analytics systems assign players to discrete, hard-bounded clusters using algorithms like $k$-Means. However, modern elite football players are rarely unidimensional; midfielders often exhibit both "Deep-Lying Playmaker" and "Box-to-Box Engine" traits, while inverted fullbacks share traits with defensive midfielders. Hard clustering forces a binary classification ($C_k \in \{0, 1\}$) and loses nuanced tactical flexibility.

## Decision
Implement a Gaussian Mixture Model (GMM) with soft expectation-maximization probability distributions:
\[
P(C_k \mid \mathbf{x}) = \frac{\pi_k \mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}_k, \boldsymbol{\Sigma}_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}_j, \boldsymbol{\Sigma}_j)}
\]
where each player $\mathbf{x} \in \mathbb{R}^8$ receives a continuous probability vector $\mathbf{p} = [p_1, p_2, \dots, p_K]$ satisfying $\sum p_k = 1.0$.

## Alternatives Considered

### Hard $k$-Means Only
- **Pros**: Computationally fast and easy to explain.
- **Cons**: Cannot represent multi-positional versatility or borderline archetype fits.
- **Rejected**: Loses tactical nuance for elite hybrid players.

### Agglomerative Hierarchical Clustering
- **Pros**: Good dendrogram visualization for small datasets.
- **Cons**: $O(N^3)$ computational complexity, hard cluster boundaries, expensive to infer for new players.
- **Rejected**: Poor scalability and lacks continuous probability outputs.

## Consequences
- Every player profile displays continuous percentage memberships across all tactical archetypes.
- Enables the GMM Archetype Studio to compute exact $z$-score deviations ($\sigma$-distances) from the cluster centroid.
- Increased runtime inference from $O(1)$ to calculating Gaussian density across $K=4$ clusters (still $<1\text{ms}$ in NumPy).
