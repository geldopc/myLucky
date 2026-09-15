import { Button } from "@elements/Button";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { GAMES_PER_SET } from "@utils/pricing";

type SetPickerProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

export function SetPicker({ value, min, max, onChange }: SetPickerProps) {
  return (
    <div id="set-picker" className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          id="set-decrease"
          variant="outline"
          size="icon"
          aria-label="Menos uma sequência da sorte"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <MinusIcon weight="regular" />
        </Button>
        <output
          id="set-value"
          aria-label={`${value} sequências da sorte`}
          className="font-heading w-10 text-center text-2xl tabular-nums"
        >
          {value}
        </output>
        <Button
          id="set-increase"
          variant="outline"
          size="icon"
          aria-label="Mais uma sequência da sorte"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <PlusIcon weight="regular" />
        </Button>
      </div>
      <span className="text-sm text-muted-foreground">
        {value > 1 ? `${value} × ${GAMES_PER_SET} = ` : ""}
        <span className="text-foreground">{value * GAMES_PER_SET} jogos</span> na mão
      </span>
    </div>
  );
}
