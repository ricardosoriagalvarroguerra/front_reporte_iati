import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./App.css";

function App() {
  const chartRef1 = useRef();
  const chartRef3 = useRef();
  const treemapRef = useRef();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Datos de aprobaciones ordenados de mayor a menor con nombres completos
    const dataAprobaciones = [
      { country: "Paraguay", amount: 1266.01 },
      { country: "Argentina", amount: 1113.67 },
      { country: "Brasil", amount: 888.36 },
      { country: "Uruguay", amount: 863.54 },
      { country: "Bolivia", amount: 676.52 }
    ];

    // Datos de desembolsos ordenados de mayor a menor con nombres completos
    const dataDesembolsos = [
      { country: "Argentina", amount: 657.46 },
      { country: "Uruguay", amount: 454.87 },
      { country: "Bolivia", amount: 453.36 },
      { country: "Paraguay", amount: 366.24 },
      { country: "Brasil", amount: 304.20 }
    ];

    // Datos para el treemap de sectores
    const allSectorsData = [
      { codigo: "21010", sector: "Transport policy and administrative management", valor_usd: 1692.53 },
      { codigo: "43030", sector: "Urban development and management", valor_usd: 447.01 },
      { codigo: "14020", sector: "Water supply and sanitation – large systems", valor_usd: 410.50 },
      { codigo: "210", sector: "Transport and Storage", valor_usd: 406.55 },
      { codigo: "43032", sector: "Urban development", valor_usd: 359.10 },
      { codigo: "16020", sector: "Employment creation", valor_usd: 240.00 },
      { codigo: "16010", sector: "Social Protection", valor_usd: 200.00 },
      { codigo: "15112", sector: "Decentralisation and support to subnational government", valor_usd: 120.00 },
      { codigo: "33120", sector: "Trade facilitation", valor_usd: 105.00 },
      { codigo: "24030", sector: "Formal sector financial intermediaries", valor_usd: 95.00 },
      { codigo: "12110", sector: "Health policy and administrative management", valor_usd: 87.00 },
      { codigo: "14021", sector: "Water supply – large systems", valor_usd: 78.60 },
      { codigo: "23110", sector: "Energy policy and administrative management", valor_usd: 70.00 },
      { codigo: "15150", sector: "Democratic participation and civil society", valor_usd: 50.00 },
      { codigo: "23630", sector: "Electric power transmission and distribution – centralised grids", valor_usd: 45.00 },
      { codigo: "31120", sector: "Agricultural development", valor_usd: 41.70 },
      { codigo: "410", sector: "General environmental protection", valor_usd: 40.00 },
      { codigo: "14032", sector: "Basic sanitation", valor_usd: 33.00 },
      { codigo: "14030", sector: "Basic drinking water supply and basic sanitation", valor_usd: 30.00 },
      { codigo: "15185", sector: "Local government administration", valor_usd: 28.00 },
      { codigo: "16040", sector: "Low-cost housing", valor_usd: 25.00 },
      { codigo: "43040", sector: "Rural development", valor_usd: 24.67 },
      { codigo: "12230", sector: "Basic health infrastructure", valor_usd: 22.67 },
      { codigo: "33210", sector: "Tourism policy and administrative management", valor_usd: 22.26 },
      { codigo: "74020", sector: "Multi-hazard response preparedness", valor_usd: 20.00 },
      { codigo: "12191", sector: "Medical services", valor_usd: 20.00 },
      { codigo: "15114", sector: "Domestic revenue mobilisation", valor_usd: 20.00 },
      { codigo: "15110", sector: "Public sector policy and administrative management", valor_usd: 19.50 },
      { codigo: "22040", sector: "Information and communication technology (ICT)", valor_usd: 18.00 },
      { codigo: "11220", sector: "Primary education", valor_usd: 15.00 },
      { codigo: "43010", sector: "Multisector aid", valor_usd: 10.00 },
      { codigo: "22010", sector: "Communications policy and administrative management", valor_usd: 7.00 },
      { codigo: "15117", sector: "Budget planning", valor_usd: 5.00 }
    ];

    // Obtener top 26 y agrupar el resto
    const top26 = allSectorsData.slice(0, 26);
    const others = allSectorsData.slice(26);
    const othersTotal = others.reduce((sum, item) => sum + item.valor_usd, 0);
    
    const treemapData = [
      ...top26,
      { codigo: "OTROS", sector: "Otros sectores", valor_usd: othersTotal }
    ];

    // Función para crear treemap
    const createTreemap = () => {
      // Limpiar el contenedor
      d3.select(treemapRef.current).selectAll("*").remove();

      // Configuración del treemap
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };
      const width = 540 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3.select(treemapRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Preparar datos para el treemap
      const treemapDataWithRoot = [
        { id: "root", parentId: null },
        ...treemapData.map(d => ({ ...d, id: d.codigo, parentId: "root" }))
      ];

      const root = d3.stratify()
        .id(d => d.id)
        .parentId(d => d.parentId)
        (treemapDataWithRoot);

      root.sum(d => d.valor_usd || 0);

      // Crear el layout del treemap
      const treemap = d3.treemap()
        .size([width, height])
        .padding(2);

      treemap(root);

             // Escala de colores personalizada basada en #d90429
       const colorScale = d3.scaleSequential()
         .domain([0, d3.max(treemapData, d => d.valor_usd)])
         .interpolator(d3.interpolateRgb("#ffebee", "#d90429"));

       // Función para obtener color (especial para "Otros")
       const getColor = (d) => {
         if (d.data.codigo === "OTROS") {
           return "#6c757d"; // Color gris para "Otros"
         }
         return colorScale(d.data.valor_usd);
       };

             // Crear los rectángulos del treemap
       const nodes = svg.selectAll("g")
         .data(root.leaves())
         .enter()
         .append("g")
         .attr("transform", d => `translate(${d.x0},${d.y0})`);

       // Crear tooltip
       const tooltip = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("position", "absolute")
         .style("background", isDarkMode ? "#333" : "white")
         .style("border", "1px solid #ccc")
         .style("border-radius", "5px")
         .style("padding", "10px")
         .style("font-size", "12px")
         .style("pointer-events", "none")
         .style("opacity", 0)
         .style("box-shadow", "0 2px 8px rgba(0,0,0,0.2)")
         .style("z-index", 1000);

       // Rectángulos
       nodes.append("rect")
         .attr("width", d => d.x1 - d.x0)
         .attr("height", d => d.y1 - d.y0)
         .attr("fill", d => getColor(d))
         .attr("stroke", "#000")
         .attr("stroke-width", 1)
         .attr("rx", 3)
         .attr("ry", 3)
         .style("transition", "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)")
         .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
         .style("opacity", 0)
         .on("mouseover", function(event, d) {
           // Mantener el rectángulo actual con su color original
           d3.select(this)
             .attr("stroke", "#d90429")
             .attr("stroke-width", 3)
             .style("filter", "drop-shadow(0 8px 16px rgba(217,4,41,0.4))")
             .style("z-index", "10");
           
           // Hacer transparentes los otros rectángulos
           nodes.selectAll("rect")
             .filter(rect => rect !== d)
             .style("opacity", 0.3);
           
           // Mostrar tooltip
           tooltip.transition()
             .duration(200)
             .style("opacity", 1);
           
           tooltip.html(`
             <div style="color: ${isDarkMode ? '#fff' : '#333'}">
               <strong>Código IATI:</strong> ${d.data.codigo}<br>
               <strong>Sector:</strong> ${d.data.sector}<br>
               <strong>Monto:</strong> $${d.data.valor_usd.toFixed(2)}M USD
             </div>
           `)
             .style("left", (event.pageX + 10) + "px")
             .style("top", (event.pageY - 10) + "px");
         })
         .on("mouseout", function(event, d) {
           // Restaurar el rectángulo actual
           d3.select(this)
             .attr("stroke", "#000")
             .attr("stroke-width", 1)
             .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
             .style("z-index", "auto");
           
           // Restaurar todos los rectángulos
           nodes.selectAll("rect")
             .style("opacity", 1);
           
           // Ocultar tooltip
           tooltip.transition()
             .duration(500)
             .style("opacity", 0);
         })
         .transition()
         .duration(800)
         .delay((d, i) => i * 50)
         .style("opacity", 1)
         .ease(d3.easeElasticOut);

       // Texto del sector (nombre completo)
       nodes.append("text")
         .attr("x", 4)
         .attr("y", 12)
         .style("font-size", "7px")
         .style("font-weight", "bold")
         .style("fill", "white")
         .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)")
         .style("opacity", 0)
         .text(d => {
           const sector = d.data.sector;
           const rectWidth = d.x1 - d.x0;
           const maxChars = Math.floor(rectWidth / 4.5); // Aproximadamente 4.5px por carácter
           if (sector && sector.length > maxChars) {
             return sector.substring(0, maxChars) + "...";
           }
           return sector;
         })
         .transition()
         .duration(600)
         .delay((d, i) => i * 50 + 400)
         .style("opacity", 1);

       // Valor en USD
       nodes.append("text")
         .attr("x", 4)
         .attr("y", 24)
         .style("font-size", "7px")
         .style("fill", "white")
         .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)")
         .style("opacity", 0)
         .text(d => `${d.data.valor_usd.toFixed(1)}M`)
         .transition()
         .duration(600)
         .delay((d, i) => i * 50 + 600)
         .style("opacity", 1);
    };

    // Función para crear gráfico
    const createChart = (data, chartRef, title) => {
      // Limpiar el contenedor
      d3.select(chartRef.current).selectAll("*").remove();

      // Configuración del gráfico
      const margin = { top: 15, right: 70, bottom: 30, left: 20 };
      const width = 550 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Escalas (invertidas)
      const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d.country))
        .padding(0.2);

      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.amount)])
        .range([0, width]);

      // Solo eje X sin líneas - etiquetas específicas según el gráfico
      let xAxis;
      if (title === "Aprobaciones") {
        xAxis = d3.axisBottom(x).tickValues([200, 600, 1000]);
      } else {
        xAxis = d3.axisBottom(x).tickValues([200, 400, 600]);
      }

      // Eje X sin líneas
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .call(g => g.selectAll("line").remove())
        .call(g => g.selectAll("path").remove())
        .selectAll("text")
        .style("font-size", "10px")
        .style("fill", isDarkMode ? "white" : "#333");

      // Color específico según el gráfico
      const barColor = title === "Aprobaciones" ? "#d90429" : "#6c757d";
      const hoverColor = title === "Aprobaciones" ? "#e63946" : "#495057";
      const darkColor = title === "Aprobaciones" ? "#8b0000" : "#343a40";

      // Barras con efectos de resaltado
      const bars = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => y(d.country))
        .attr("width", 0) // Empezar con ancho 0 para animación
        .attr("height", y.bandwidth())
        .attr("fill", barColor)
        .attr("rx", 4)
        .attr("ry", 4)
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("transition", "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
        .on("mouseover", function(event, d) {
          // Resaltar la barra actual
          d3.select(this)
            .attr("fill", hoverColor)
            .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.3))")
            .transition()
            .duration(300)
            .attr("width", d => x(d.amount) + 15);
          
          // Oscurecer las otras barras
          bars.filter(bar => bar !== d)
            .attr("fill", darkColor)
            .style("opacity", 0.6);
        })
        .on("mouseout", function(event, d) {
          // Restaurar colores originales
          d3.select(this)
            .attr("fill", barColor)
            .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
            .transition()
            .duration(300)
            .attr("width", d => x(d.amount));
          
          // Restaurar las otras barras
          bars.attr("fill", barColor)
            .style("opacity", 1);
        });

      // Animación de entrada de las barras
      bars.transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr("width", d => x(d.amount))
        .ease(d3.easeElasticOut);

      // Etiquetas de países dentro de las barras
      svg.selectAll("text.country-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "country-label")
        .attr("x", 8)
        .attr("y", d => y(d.country) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("font-size", "10px")
        .style("font-weight", "600")
        .style("fill", "white")
        .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)")
        .style("opacity", 0)
        .text(d => d.country)
        .transition()
        .duration(600)
        .delay((d, i) => i * 100 + 400)
        .style("opacity", 1);

      // Etiquetas de valores
      svg.selectAll("text.value")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "value")
        .attr("x", d => x(d.amount) + 15)
        .attr("y", d => y(d.country) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("font-size", "9px")
        .style("font-weight", "bold")
        .style("fill", isDarkMode ? "#e0e0e0" : "#666")
        .style("opacity", 0)
        .text(d => `${d.amount.toFixed(1)}M`)
        .transition()
        .duration(600)
        .delay((d, i) => i * 100 + 600)
        .style("opacity", 1);
    };

    // Crear ambos gráficos
    createChart(dataAprobaciones, chartRef1, "Aprobaciones");
    createChart(dataDesembolsos, chartRef3, "Desembolsos");
    createTreemap(); // Call the new treemap function

  }, [isDarkMode]);

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="titulo-card">
        <span className="titulo">FONPLATA - IATI</span>
      </div>
      
      <div className="publicacion-card">
        <span className="publicacion-texto">Publicación: 08-2025</span>
      </div>
      
      {/* Botón de cambio de tema */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        title={isDarkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
      
      <div className="cards-container">
        {/* Primer card con gráfico de barras */}
        <div className="card card-1">
          <div className="card-header">
            <h3>Aprobaciones</h3>
            <button 
              className="info-button"
              title="Aprobaciones en millones de USD"
              onClick={() => {
                const tooltip = document.createElement('div');
                tooltip.className = 'info-tooltip';
                tooltip.textContent = 'Aprobaciones en millones de USD';
                tooltip.style.cssText = `
                  position: absolute;
                  background: ${isDarkMode ? '#333' : 'white'};
                  color: ${isDarkMode ? '#fff' : '#333'};
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  padding: 8px 12px;
                  font-size: 12px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                  z-index: 1000;
                  pointer-events: none;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                `;
                document.body.appendChild(tooltip);
                
                const button = event.target;
                const rect = button.getBoundingClientRect();
                tooltip.style.left = (rect.left - 150) + 'px';
                tooltip.style.top = (rect.top + 25) + 'px';
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
                
                setTimeout(() => {
                  tooltip.style.opacity = '0';
                  setTimeout(() => document.body.removeChild(tooltip), 300);
                }, 3000);
              }}
            >
              ?
            </button>
          </div>
          <div ref={chartRef1} className="chart-container"></div>
        </div>
        
        {/* Segundo card combinado (Sectores + Card 4) */}
        <div className="card card-2">
          <div className="card-header">
            <h3>Sectores</h3>
            <button 
              className="info-button"
              title="Sectores de nuestras actividades en millones de USD"
              onClick={() => {
                const tooltip = document.createElement('div');
                tooltip.className = 'info-tooltip';
                tooltip.textContent = 'Sectores de nuestras actividades en millones de USD';
                tooltip.style.cssText = `
                  position: absolute;
                  background: ${isDarkMode ? '#333' : 'white'};
                  color: ${isDarkMode ? '#fff' : '#333'};
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  padding: 8px 12px;
                  font-size: 12px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                  z-index: 1000;
                  pointer-events: none;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                `;
                document.body.appendChild(tooltip);
                
                const button = event.target;
                const rect = button.getBoundingClientRect();
                tooltip.style.left = (rect.left + 25) + 'px';
                tooltip.style.top = (rect.top + 25) + 'px';
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
                
                setTimeout(() => {
                  tooltip.style.opacity = '0';
                  setTimeout(() => document.body.removeChild(tooltip), 300);
                }, 3000);
              }}
            >
              ?
            </button>
          </div>
          <div ref={treemapRef} className="treemap-container"></div>
        </div>
        
        {/* Tercer card debajo del primero */}
        <div className="card card-3">
          <div className="card-header">
            <h3>Desembolsos</h3>
            <button 
              className="info-button"
              title="Desembolsos en millones USD"
              onClick={() => {
                const tooltip = document.createElement('div');
                tooltip.className = 'info-tooltip';
                tooltip.textContent = 'Desembolsos en millones USD';
                tooltip.style.cssText = `
                  position: absolute;
                  background: ${isDarkMode ? '#333' : 'white'};
                  color: ${isDarkMode ? '#fff' : '#333'};
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  padding: 8px 12px;
                  font-size: 12px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                  z-index: 1000;
                  pointer-events: none;
                  opacity: 0;
                  transition: opacity 0.3s ease;
                `;
                document.body.appendChild(tooltip);
                
                const button = event.target;
                const rect = button.getBoundingClientRect();
                tooltip.style.left = (rect.left - 150) + 'px';
                tooltip.style.top = (rect.top + 25) + 'px';
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
                
                setTimeout(() => {
                  tooltip.style.opacity = '0';
                  setTimeout(() => document.body.removeChild(tooltip), 300);
                }, 3000);
              }}
            >
              ?
            </button>
          </div>
          <div ref={chartRef3} className="chart-container"></div>
        </div>
      </div>
    </div>
  );
}

export default App; 