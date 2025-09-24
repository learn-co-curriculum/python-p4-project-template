/**
 * Test Suite for FoodInsights Component
 * Tests Kenyan food database integration and glucose prediction features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodInsights from '../components/FoodInsights';

// Mock data for testing
const mockKenyanFoods = [
  {
    id: 'ugali_1',
    name_english: 'Ugali',
    name_swahili: 'Ugali',
    category: 'grains',
    diabetes_friendly: false,
    nutritional_info: {
      calories_per_100g: 168,
      carbohydrates_g: 36.2,
      protein_g: 3.8,
      fat_g: 0.6,
      fiber_g: 2.1,
      glycemic_index: 85
    },
    description_english: 'Traditional cornmeal staple',
    description_swahili: 'Chakula cha msingi cha unga wa mahindi'
  },
  {
    id: 'sukuma_wiki_1',
    name_english: 'Sukuma Wiki',
    name_swahili: 'Sukuma Wiki',
    category: 'vegetables',
    diabetes_friendly: true,
    nutritional_info: {
      calories_per_100g: 65,
      carbohydrates_g: 8.5,
      protein_g: 4.2,
      fat_g: 3.1,
      fiber_g: 4.8,
      glycemic_index: 15
    },
    description_english: 'Nutritious collard greens',
    description_swahili: 'Sukuma wiki wenye virutubisho'
  }
];

// Mock fetch for API calls
global.fetch = jest.fn();

describe('FoodInsights Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockKenyanFoods
    });
  });

  test('renders component with title', () => {
    render(<FoodInsights />);
    expect(screen.getByText(/Food Insights/i)).toBeInTheDocument();
  });

  test('displays language toggle buttons', () => {
    render(<FoodInsights />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Kiswahili')).toBeInTheDocument();
  });

  test('switches language when Kiswahili button is clicked', () => {
    render(<FoodInsights />);
    const swahiliButton = screen.getByText('Kiswahili');
    fireEvent.click(swahiliButton);
    
    // Check if Swahili content appears
    expect(screen.getByText(/Maarifa ya Vyakula/i)).toBeInTheDocument();
  });

  test('displays search input', () => {
    render(<FoodInsights />);
    const searchInput = screen.getByPlaceholderText(/Search Kenyan foods/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('filters foods when searching', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      expect(screen.getByText('Ugali')).toBeInTheDocument();
      expect(screen.getByText('Sukuma Wiki')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search Kenyan foods/i);
    fireEvent.change(searchInput, { target: { value: 'ugali' } });

    await waitFor(() => {
      expect(screen.getByText('Ugali')).toBeInTheDocument();
      expect(screen.queryByText('Sukuma Wiki')).not.toBeInTheDocument();
    });
  });

  test('displays category filter buttons', () => {
    render(<FoodInsights />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Grains')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
  });

  test('filters foods by category', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      expect(screen.getByText('Ugali')).toBeInTheDocument();
    });

    const vegetablesButton = screen.getByText('Vegetables');
    fireEvent.click(vegetablesButton);

    await waitFor(() => {
      expect(screen.queryByText('Ugali')).not.toBeInTheDocument();
      expect(screen.getByText('Sukuma Wiki')).toBeInTheDocument();
    });
  });

  test('shows diabetes-friendly indicator', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const diabetesFriendlyBadges = screen.getAllByText('Diabetes Friendly');
      expect(diabetesFriendlyBadges.length).toBeGreaterThan(0);
    });
  });

  test('displays nutritional information when food is clicked', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const ugaliCard = screen.getByText('Ugali');
      fireEvent.click(ugaliCard);
    });

    await waitFor(() => {
      expect(screen.getByText(/Calories:/i)).toBeInTheDocument();
      expect(screen.getByText(/Carbohydrates:/i)).toBeInTheDocument();
      expect(screen.getByText(/Protein:/i)).toBeInTheDocument();
    });
  });

  test('shows glucose impact prediction', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const ugaliCard = screen.getByText('Ugali');
      fireEvent.click(ugaliCard);
    });

    await waitFor(() => {
      expect(screen.getByText(/Glucose Impact/i)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<FoodInsights />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error loading foods/i)).toBeInTheDocument();
    });
  });

  test('displays loading state', () => {
    render(<FoodInsights />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('shows portion size selector', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const ugaliCard = screen.getByText('Ugali');
      fireEvent.click(ugaliCard);
    });

    await waitFor(() => {
      expect(screen.getByText(/Portion Size/i)).toBeInTheDocument();
    });
  });

  test('calculates nutrition based on portion size', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const ugaliCard = screen.getByText('Ugali');
      fireEvent.click(ugaliCard);
    });

    const portionSelect = screen.getByDisplayValue('1 cup (100g)');
    fireEvent.change(portionSelect, { target: { value: '2' } });

    await waitFor(() => {
      // Should show doubled nutrition values
      expect(screen.getByText(/336/)).toBeInTheDocument(); // 168 * 2 calories
    });
  });

  test('provides health recommendations', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const ugaliCard = screen.getByText('Ugali');
      fireEvent.click(ugaliCard);
    });

    await waitFor(() => {
      expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    });
  });
});

describe('FoodInsights Accessibility', () => {
  test('has proper ARIA labels', () => {
    render(<FoodInsights />);
    
    const searchInput = screen.getByPlaceholderText(/Search Kenyan foods/i);
    expect(searchInput).toHaveAttribute('aria-label');
  });

  test('supports keyboard navigation', async () => {
    render(<FoodInsights />);
    
    const searchInput = screen.getByPlaceholderText(/Search Kenyan foods/i);
    searchInput.focus();
    
    expect(document.activeElement).toBe(searchInput);
  });

  test('has proper heading structure', () => {
    render(<FoodInsights />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
  });
});

describe('FoodInsights Performance', () => {
  test('debounces search input', async () => {
    jest.useFakeTimers();
    render(<FoodInsights />);
    
    const searchInput = screen.getByPlaceholderText(/Search Kenyan foods/i);
    
    // Type multiple characters quickly
    fireEvent.change(searchInput, { target: { value: 'u' } });
    fireEvent.change(searchInput, { target: { value: 'ug' } });
    fireEvent.change(searchInput, { target: { value: 'uga' } });
    
    // Should not have made multiple API calls yet
    expect(fetch).toHaveBeenCalledTimes(1); // Initial load only
    
    // Fast forward timers
    jest.advanceTimersByTime(500);
    
    // Now should make the search call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
    
    jest.useRealTimers();
  });
});

describe('FoodInsights Integration', () => {
  test('integrates with glucose predictor', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const ugaliCard = screen.getByText('Ugali');
      fireEvent.click(ugaliCard);
    });

    const predictButton = screen.getByText(/Predict Glucose Impact/i);
    fireEvent.click(predictButton);

    await waitFor(() => {
      expect(screen.getByText(/Predicted glucose rise/i)).toBeInTheDocument();
    });
  });

  test('saves food to meal log', async () => {
    render(<FoodInsights />);
    
    await waitFor(() => {
      const ugaliCard = screen.getByText('Ugali');
      fireEvent.click(ugaliCard);
    });

    const addToLogButton = screen.getByText(/Add to Food Log/i);
    fireEvent.click(addToLogButton);

    await waitFor(() => {
      expect(screen.getByText(/Added to food log/i)).toBeInTheDocument();
    });
  });
});
