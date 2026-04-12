export interface TankConfig {
  soil: string;
  filter: string;
  chimney: string;
  reason: string;
  maintenance: string;
}

export const tankConfigs: Record<'45' | '60', TankConfig> = {
  '45': {
    soil: '2.5–3 liters of active shrimp soil (e.g., ADA Amazonia, Netlea, UNS Controsoil). Use a thin slope toward the front. Do NOT rinse the soil—it needs to release buffering compounds. This smaller volume requires careful substrate choice to maintain stable pH levels.',
    filter:
      'Single sponge filter or low-flow hang-on-back (HOB) filter with pre-filter sponge. Avoid strong currents that can stress shrimp or disturb the biofilm. Consider using a small air pump with flow control valve for gentle water movement.',
    chimney:
      'Optional: Maximum 1 UGF chimney with gentle airflow. Use only if you understand undergravel filtration principles. Too much flow will destabilize your parameters in smaller volumes. Many successful keepers skip UGF entirely in 45cm tanks.',
    reason:
      "Smaller water volumes (33.75L) react faster to parameter changes, making them more challenging for beginners. However, this also means lower cooling costs in Singapore. Simplicity is key—minimal equipment, lower stocking density, and consistent maintenance prevent crashes. This size teaches you the fundamentals before scaling up.",
    maintenance:
      'Perform 10% weekly water changes using remineralized RO water only (never tap water). Feed very lightly—shrimp primarily graze on biofilm. Remove any leftover food within 2 hours. Monitor TDS daily for the first month, then 2-3 times weekly once stable. Keep detailed logs of parameters.',
  },
  '60': {
    soil: '6–8 liters of active shrimp soil for extended buffering capacity and longer soil life (12+ months). Create a gentle slope with deeper substrate at the back. This larger volume allows for more beneficial bacteria colonization and better nutrient processing in the substrate.',
    filter:
      'Undergravel filter (UGF) combined with sponge filter, OR canister filter with intake pre-filter sponge to protect shrimplets. The UGF creates excellent water circulation through the substrate, promoting beneficial bacteria growth. Ensure all equipment is shrimp-safe (no strong suction points).',
    chimney:
      '1 UGF chimney is standard for this tank size. You may add a 2nd chimney only for higher stocking levels (35+ shrimp), but maintain gentle airflow. Over-aeration can cause pH swings. Use quality air pumps with adjustable valves for precise flow control.',
    reason:
      'Greater water volume (45L) equals significantly more stable pH, TDS, and temperature parameters—critical for breeding success. This size provides better buffering against mistakes and environmental fluctuations. The increased water volume also supports a more robust beneficial bacteria colony, leading to better waste processing and higher survival rates for shrimplets.',
    maintenance:
      "Perform 10% weekly water changes using only remineralized RO water matched to your tank's current TDS (±10 ppm). Never use Singapore tap water—it has unsuitable TDS and pH for Caridina. Test parameters 2-3 times weekly. During breeding season, you may increase water changes to 15% if TDS creeps above 130 ppm. Keep a maintenance log to identify patterns.",
  },
};
