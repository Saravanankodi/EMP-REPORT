import { Input } from '../base/Input'
import { Button } from '../base/Button'

interface FilterState {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply: () => void;
}

function FilterForm({ filters, setFilters, onApply }: Props) {
  return (
    <section className="w-full h-fit m-auto border py-2 px-4 sm:py-5 sm:px-10 rounded-2xl sm:grid grid-cols-4 grid-rows-2 items-baseline-last justify-evenly gap-5 ">

      <Input
        label="Employee ID"
        type="text"
        value={filters.employeeId || ''}
        onChange={(e) =>
          setFilters(prev => ({ ...prev, employeeId: e.target.value }))
        }
      />

      <Input
        label="Start Date"
        type="date"
        onChange={(e) =>
          setFilters(prev => ({ ...prev, startDate: e.target.value }))
        }
      />

      <Input
        label="End Date"
        type="date"
        onChange={(e) =>
          setFilters(prev => ({ ...prev, endDate: e.target.value }))
        }
      />

      <Input
        label="Start Time"
        type="time"
        onChange={(e) =>
          setFilters(prev => ({ ...prev, startTime: e.target.value }))
        }
      />

      <Input
        label="End Time"
        type="time"
        onChange={(e) =>
          setFilters(prev => ({ ...prev, endTime: e.target.value }))
        }
      />

      <Button onClick={onApply} variant={'primary'} className='rounded-xl col-start-4 col-end-4 row-start-1 row-end-3 m-auto w-1/2 text-nowrap text-2xl ' >
        Search Range
      </Button>

    </section>
  );
}

export default FilterForm;