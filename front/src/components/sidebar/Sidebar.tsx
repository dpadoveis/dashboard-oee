import { SectionTag } from '../common/SectionTag';
import { ApplyButton } from './ApplyButton';
import { Brand } from './Brand';
import { PeriodFilter } from './PeriodFilter';
import { PlantSelector } from './PlantSelector';

interface SidebarProps {
  plant: string;
}

export function Sidebar({ plant }: SidebarProps) {
  return (
    <aside className="sidebar">
      <Brand />

      <div>
        <SectionTag num="01" label="Planta" />
        <PlantSelector current={plant} />
      </div>

      <div>
        <SectionTag num="02" label="Período" />
        <PeriodFilter />
      </div>

      <ApplyButton />
    </aside>
  );
}
