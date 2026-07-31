/** Вставка микроразметки. Значения приходят только из проверенных хелперов. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Данные формируются на сервере из типизированного контента.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
