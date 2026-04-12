/**
 * Renders JSON-LD structured data as a <script type="application/ld+json">.
 *
 * Uses React 19's native script children support — no dangerouslySetInnerHTML.
 * The `data` prop must always be a hardcoded TypeScript object from data/*.ts,
 * never user-generated content. <script type="application/ld+json"> is not
 * executed as JavaScript and is exempt from script-src CSP.
 *
 * Ref: https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
 */
export function JsonLd({ data, id }: { data: Record<string, unknown>; id: string }) {
  // React 19 renders string children inside <script> tags directly.
  // JSON.stringify on a hardcoded TS object is safe — all special chars are escaped.
  return (
    <script id={id} type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  );
}
