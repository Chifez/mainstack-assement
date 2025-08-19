import Image from "next/image";
import { Button } from "@/components/ui/button";

export function EmptyTransactions({ onClearFilter }: { onClearFilter: () => void }) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex flex-col items-start">
          <div className="mb-4 rounded-xl bg-muted w-fit p-4">
            <Image
              src="/receipt_long.svg"
              height={16}
              width={16}
              alt="receipt"
              priority
            />
          </div>
          <h3 className="text-lg font-bold text-start">
            No matching transaction found <br /> for the selected filter
          </h3>
          <p className="text-sm text-muted-foreground">
            Change your filters to see more results, or add a new transaction
          </p>
          <Button
            variant="outline"
            className="mt-4 w-fit rounded-full font-semibold bg-[#eff1f5]"
            onClick={onClearFilter}
          >
            Clear Filter
          </Button>
        </div>
      </div>
    );
  }