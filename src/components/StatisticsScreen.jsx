import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function StatisticsScreen({ recipes, products, expenses }) {
  // Estadísticas de recetas
  const recipeStats = useMemo(() => {
    const totalRecipes = recipes.length;
    const byCategory = {};
    const mostExpensive = recipes
      .map(r => {
        let cost = 0;
        if (r.costData) {
          r.costData.forEach(row => {
            if (row.productId) {
              const product = products.find(p => p.id === row.productId);
              if (product) {
                const qAdq = parseFloat(product.quantity) || 0;
                const price = parseFloat(product.price) || 0;
                const qUsed = parseFloat(row.quantityUsed) || 0;
                cost += qAdq ? (qUsed * price / qAdq) : 0;
              }
            }
          });
        }
        return { name: r.name, cost };
      })
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);

    recipes.forEach(r => {
      const cat = r.category || 'Sin categoría';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    return { totalRecipes, byCategory, mostExpensive };
  }, [recipes, products]);

  // Estadísticas de productos
  const productStats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock !== null && parseFloat(p.stock) < 10);
    const bySupplier = {};
    products.forEach(p => {
      const supplier = p.supplier || 'Sin proveedor';
      bySupplier[supplier] = (bySupplier[supplier] || 0) + 1;
    });

    return { totalProducts, lowStock, bySupplier };
  }, [products]);

  // Estadísticas de gastos
  const expenseStats = useMemo(() => {
    const totalMonthly = expenses.reduce((sum, e) => sum + (parseFloat(e.monthlyAmount) || 0), 0);
    const byCategory = {};
    expenses.forEach(e => {
      const cat = e.category || 'Sin categoría';
      byCategory[cat] = (byCategory[cat] || 0) + parseFloat(e.monthlyAmount || 0);
    });

    return { totalMonthly, byCategory };
  }, [expenses]);

  const categoryData = Object.entries(recipeStats.byCategory).map(([name, value]) => ({ name, value }));
  const supplierData = Object.entries(productStats.bySupplier).map(([name, value]) => ({ name, value }));
  const expenseCategoryData = Object.entries(expenseStats.byCategory).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="screen active">
      <div className="screen-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Estadísticas y Reportes</h2>

        {/* Resumen general */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Total Recetas</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366F1' }}>
              {recipeStats.totalRecipes}
            </div>
          </div>
          <div className="card">
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Total Productos</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>
              {productStats.totalProducts}
            </div>
          </div>
          <div className="card">
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Gastos Mensuales</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#EF4444' }}>
              ${expenseStats.totalMonthly.toFixed(2)}
            </div>
          </div>
          <div className="card">
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Stock Bajo</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: productStats.lowStock.length > 0 ? '#EF4444' : '#10B981' }}>
              {productStats.lowStock.length}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {categoryData.length > 0 && (
            <div className="card">
              <h3>Recetas por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {recipeStats.mostExpensive.length > 0 && (
            <div className="card">
              <h3>Recetas Más Costosas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recipeStats.mostExpensive}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {expenseCategoryData.length > 0 && (
            <div className="card">
              <h3>Gastos por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Lista de productos con stock bajo */}
        {productStats.lowStock.length > 0 && (
          <div className="card">
            <h3>Productos con Stock Bajo</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock Actual</th>
                    <th>Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {productStats.lowStock.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td style={{ color: '#EF4444', fontWeight: 'bold' }}>{product.stock}</td>
                      <td>{product.unit || 'g'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatisticsScreen;

