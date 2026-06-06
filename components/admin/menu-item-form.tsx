import type { MenuItem } from "@/lib/generated/prisma/client";

type Props = {
  action: (formData: FormData) => Promise<void>;
  item?: MenuItem;
  submitLabel: string;
};

const inputClass =
  "mt-2 w-full border border-brown-200 bg-white px-4 py-3 text-sm text-brown-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export function MenuItemForm({ action, item, submitLabel }: Props) {
  return (
    <form action={action} className="grid gap-6">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium text-brown-700">
          Name
          <input className={inputClass} name="name" required defaultValue={item?.name} />
        </label>
        <label className="text-sm font-medium text-brown-700">
          Slug
          <input className={inputClass} name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={item?.slug} />
        </label>
      </div>

      <label className="text-sm font-medium text-brown-700">
        Description
        <textarea className={`${inputClass} min-h-28`} name="description" required defaultValue={item?.description} />
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="text-sm font-medium text-brown-700">
          Price
          <input className={inputClass} name="price" type="number" min="0" step="0.01" required defaultValue={item ? Number(item.price) : 0} />
        </label>
        <label className="text-sm font-medium text-brown-700">
          Stock quantity
          <input className={inputClass} name="stockQuantity" type="number" min="0" step="1" placeholder="Blank means unlimited" defaultValue={item?.stockQuantity ?? ""} />
        </label>
        <label className="text-sm font-medium text-brown-700">
          Sort order
          <input className={inputClass} name="sortOrder" type="number" min="0" step="1" required defaultValue={item?.sortOrder ?? 0} />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium text-brown-700">
          Category
          <select className={inputClass} name="category" defaultValue={item?.category ?? "BREAKFAST"}>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DRINKS">Drinks</option>
            <option value="DESSERT">Dessert</option>
          </select>
        </label>
        <label className="text-sm font-medium text-brown-700">
          Serving
          <input className={inputClass} name="serving" required defaultValue={item?.serving} />
        </label>
      </div>

      <label className="text-sm font-medium text-brown-700">
        Image URL
        <input className={inputClass} name="imageUrl" required defaultValue={item?.imageUrl} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(["calories", "protein", "carbs", "fats"] as const).map((field) => (
          <label key={field} className="text-sm font-medium capitalize text-brown-700">
            {field}
            <input className={inputClass} name={field} type="number" min="0" step="0.01" required defaultValue={item ? Number(item[field]) : 0} />
          </label>
        ))}
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-brown-700">
        <input name="isAvailable" type="checkbox" defaultChecked={item?.isAvailable ?? true} className="h-4 w-4 accent-orange-500" />
        Available for customers
      </label>

      <div>
        <button className="bg-brown-900 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-orange-600">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
