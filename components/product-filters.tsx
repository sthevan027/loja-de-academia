"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FilterOption {
  id: number
  label: string
}

interface FilterGroup {
  id: number
  name: string
  options: FilterOption[]
}

interface ProductFiltersProps {
  filters: FilterGroup[]
  activeFilters: Record<string, string[]>
  currentUrl: string
}

export default function ProductFilters({ filters, activeFilters, currentUrl }: ProductFiltersProps) {
  const router = useRouter()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(filters.map((filter) => [filter.id.toString(), true])),
  )
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>(activeFilters)

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleFilterChange = (filterId: string, optionLabel: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const current = prev[filterId] || []
      if (checked) {
        return { ...prev, [filterId]: [...current, optionLabel] }
      } else {
        return { ...prev, [filterId]: current.filter((item) => item !== optionLabel) }
      }
    })
  }

  const applyFilters = () => {
    const url = new URL(currentUrl, window.location.origin)

    // Limpar filtros existentes
    for (const key of url.searchParams.keys()) {
      if (key.startsWith("filter_")) {
        url.searchParams.delete(key)
      }
    }

    // Adicionar novos filtros
    Object.entries(localFilters).forEach(([filterId, values]) => {
      if (values.length > 0) {
        url.searchParams.set(`filter_${filterId}`, values.join(","))
      }
    })

    router.push(url.pathname + url.search)
  }

  const clearFilters = () => {
    setLocalFilters({})

    const url = new URL(currentUrl, window.location.origin)

    // Limpar filtros existentes
    for (const key of url.searchParams.keys()) {
      if (key.startsWith("filter_")) {
        url.searchParams.delete(key)
      }
    }

    router.push(url.pathname + url.search)
  }

  const hasActiveFilters = Object.values(localFilters).some((values) => values.length > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs rounded-full">
            <X className="mr-1 h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {filters.map((filter) => (
          <Collapsible
            key={filter.id}
            open={openSections[filter.id.toString()]}
            className="border rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger
              className="flex w-full items-center justify-between p-3 font-medium"
              onClick={() => toggleSection(filter.id.toString())}
            >
              {filter.name}
              {openSections[filter.id.toString()] ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="space-y-2">
                {filter.options.map((option) => {
                  const isChecked = (localFilters[filter.id.toString()] || []).includes(option.label)
                  return (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-${filter.id}-${option.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleFilterChange(filter.id.toString(), option.label, checked === true)
                        }
                      />
                      <label htmlFor={`filter-${filter.id}-${option.id}`} className="text-sm cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <Button onClick={applyFilters} className="w-full bg-red-600 hover:bg-red-700 rounded-full">
          Aplicar Filtros
        </Button>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(localFilters).map(([filterId, values]) =>
              values.map((value) => {
                const filterName = filters.find((f) => f.id.toString() === filterId)?.name || ""
                return (
                  <Badge
                    key={`${filterId}-${value}`}
                    variant="outline"
                    className="rounded-full flex items-center gap-1 px-3 py-1"
                  >
                    <span className="text-xs">
                      {filterName}: {value}
                    </span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange(filterId, value, false)} />
                  </Badge>
                )
              }),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
