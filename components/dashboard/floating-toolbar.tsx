import Image from 'next/image';

export function FloatingToolbar() {
  return (
    <div className="fixed left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40 border border-gray-100 bg-white shadow-sm rounded-full p-1">
      <div className="size-8 rounded-full   flex items-center justify-center">
        <Image
          src="/product_one.svg"
          height={16}
          width={16}
          alt="products"
          priority
        />
      </div>
      <div className="size-8 rounded-full  flex items-center justify-center">
        <Image
          src="/product_two.svg"
          height={16}
          width={16}
          alt="products"
          priority
        />
      </div>
      <div className="size-8 rounded-full  flex items-center justify-center">
        <Image
          src="/product_three.svg"
          height={16}
          width={16}
          alt="products"
          priority
        />
      </div>
      <div className="size-8 rounded-full  flex items-center justify-center">
        <Image
          src="/product_four.svg"
          height={16}
          width={16}
          alt="products"
          priority
        />
      </div>
    </div>
  );
}
