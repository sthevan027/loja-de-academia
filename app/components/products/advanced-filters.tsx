'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface AdvancedFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  brands: FilterOption[];
  onBrandsChange: (brands: string[]) => void;
  ratings: FilterOption[];
  onRatingsChange: (ratings: number[]) => void;
  materials: FilterOption[];
  onMaterialsChange: (materials: string[]) => void;
  weights: FilterOption[];
  onWeightsChange: (weights: string[]) => void;
  onApplyFilters: () => void;
}

export function AdvancedFilters({
  priceRange,
  onPriceRangeChange,
  brands,
  onBrandsChange,
  ratings,
  onRatingsChange,
  materials,
  onMaterialsChange,
  weights,
  onWeightsChange,
  onApplyFilters,
}: AdvancedFiltersProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);

  const handleBrandChange = (brandId: string) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(newBrands);
    onBrandsChange(newBrands);
  };

  const handleRatingChange = (rating: number) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(newRatings);
    onRatingsChange(newRatings);
  };

  const handleMaterialChange = (materialId: string) => {
    const newMaterials = selectedMaterials.includes(materialId)
      ? selectedMaterials.filter((id) => id !== materialId)
      : [...selectedMaterials, materialId];
    setSelectedMaterials(newMaterials);
    onMaterialsChange(newMaterials);
  };

  const handleWeightChange = (weightId: string) => {
    const newWeights = selectedWeights.includes(weightId)
      ? selectedWeights.filter((id) => id !== weightId)
      : [...selectedWeights, weightId];
    setSelectedWeights(newWeights);
    onWeightsChange(newWeights);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Faixa de Preço</Label>
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            min={0}
            max={1000}
            step={10}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Marcas</Label>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => handleBrandChange(brand.id)}
                />
                <Label htmlFor={`brand-${brand.id}`} className="flex-1">
                  {brand.name} ({brand.count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Avaliações</Label>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div key={rating.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating.id}`}
                  checked={selectedRatings.includes(Number(rating.id))}
                  onCheckedChange={() => handleRatingChange(Number(rating.id))}
                />
                <Label htmlFor={`rating-${rating.id}`} className="flex-1">
                  {rating.name} ({rating.count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Materiais</Label>
          <div className="space-y-2">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material.id}`}
                  checked={selectedMaterials.includes(material.id)}
                  onCheckedChange={() => handleMaterialChange(material.id)}
                />
                <Label htmlFor={`material-${material.id}`} className="flex-1">
                  {material.name} ({material.count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Pesos</Label>
          <div className="space-y-2">
            {weights.map((weight) => (
              <div key={weight.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`weight-${weight.id}`}
                  checked={selectedWeights.includes(weight.id)}
                  onCheckedChange={() => handleWeightChange(weight.id)}
                />
                <Label htmlFor={`weight-${weight.id}`} className="flex-1">
                  {weight.name} ({weight.count})
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={onApplyFilters}>
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  );
} 