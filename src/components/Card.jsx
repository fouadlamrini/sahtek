import React, { useState } from 'react';
import dataProduct from '../data/data';

const Card = () => {
  // State dyal les produits selected (Array d les IDs)
  const [selectedIds, setSelectedIds] = useState([]);

  // State dyal Quantité dyal kol produit { [id]: quantité }
  const [quantities, setQuantities] = useState(
    dataProduct.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );

  // State dyal Accordion (Modifier open/close) { [id]: boolean }
  const [openAccordions, setOpenAccordions] = useState({});

  // State dyal Notes dyal kol produit { [id]: text }
  const [notes, setNotes] = useState({});

  // 1. Toggle Selection d Product
  const handleSelectProduct = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      setOpenAccordions((prev) => ({ ...prev, [id]: false }));
    } else {
      setSelectedIds([...selectedIds, id]);
      // Accordion kay-bqa msddoud mni kat-selectionner (y-cliki 3la Modifier bash y-ftho)
      setOpenAccordions((prev) => ({ ...prev, [id]: false }));
    }
  };

  // 2. Select All / Deselect All
  const handleSelectAll = () => {
    if (selectedIds.length === dataProduct.length) {
      setSelectedIds([]);
      setOpenAccordions({});
    } else {
      const allIds = dataProduct.map((p) => p.id);
      setSelectedIds(allIds);
      setOpenAccordions({});
    }
  };

  // 3. Modifier Quantité (+ / -)
  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      const newQty = Math.max(1, currentQty + delta);
      return { ...prev, [id]: newQty };
    });
  };

  // 4. Toggle Accordion
  const toggleAccordion = (id) => {
    if (!selectedIds.includes(id)) return;
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 5. Update Note
  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  // 6. Calcul Total & Remise
  const subtotal = dataProduct.reduce((sum, product) => {
    if (selectedIds.includes(product.id)) {
      const qty = quantities[product.id] || 1;
      return sum + product.price * qty;
    }
    return sum;
  }, 0);

  const isAllSelected = selectedIds.length === dataProduct.length && dataProduct.length > 0;
  const discount = isAllSelected ? 10 : 0;
  const total = Math.max(0, subtotal - discount);

  // 7. Envoi WhatsApp
  const handleWhatsAppOrder = () => {
    if (selectedIds.length === 0) {
      alert("Afack khtar 3la l-aqal plat wahad!");
      return;
    }

    let message = `*Salam, bghit n-commander had les plats:*\n\n`;

    dataProduct.forEach((p) => {
      if (selectedIds.includes(p.id)) {
        const qty = quantities[p.id] || 1;
        const noteText = notes[p.id] ? `\n   📝 *Note:* ${notes[p.id]}` : '';
        message += `🍽️ *${p.name}* (${p.jour})\n   - Quantité: ${qty}\n   - Prix: ${p.price * qty} DH${noteText}\n\n`;
      }
    });

    if (discount > 0) {
      message += `🎁 *Remise Semaine (Tous les jours):* -10 DH\n`;
    }

    message += `💰 *Total Final: ${total} DH*`;

    // Clean phone number (Format: 212656536985)
    const rawPhoneNumber = "+212 656-536985"; 
    const phoneNumber = rawPhoneNumber.replace(/[^0-9]/g, ''); 
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 bg-white">
      {/* Header & Checkbox Tout Sélectionner */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#204115]">Menu de la Semaine</h2>
        <label className="flex items-center space-x-2 cursor-pointer font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            style={{ accentColor: '#E58730' }}
            className="w-5 h-5 rounded cursor-pointer"
          />
          <span>Sélectionner tout</span>
        </label>
      </div>

      {/* Grid dyal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {dataProduct.map((product) => {
          const isSelected = selectedIds.includes(product.id);
          const isOpen = !!openAccordions[product.id];
          const qty = quantities[product.id] || 1;

          return (
            <div
              key={product.id}
              style={{
                borderColor: isSelected ? '#E58730' : '#e5e7eb',
              }}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden ${
                isSelected ? 'ring-2 ring-[#E58730]/20' : ''
              }`}
            >
              {/* Card Body */}
              <div className="p-4 flex gap-4 items-center">
                {/* Checkbox Button */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectProduct(product.id)}
                  style={{ accentColor: '#E58730' }}
                  className="w-5 h-5 rounded cursor-pointer flex-shrink-0"
                />

                {/* Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span 
                    style={{ backgroundColor: '#E58730', color: '#ffffff' }}
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  >
                    {product.jour}
                  </span>
                  <h3 className="font-bold text-gray-800 text-base truncate mt-1">
                    {product.name}
                  </h3>
                  <p 
                    style={{ color: '#204115' }}
                    className="font-extrabold text-sm mt-0.5"
                  >
                    {product.price} DH
                  </p>
                </div>
              </div>

              {/* Accordion Trigger (Ila kan selected) */}
              {isSelected && (
                <div className="border-t border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => toggleAccordion(product.id)}
                    style={{ color: '#E58730' }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-100 flex justify-between items-center transition-colors"
                  >
                    <span>Modifier (Quantité & Notes)</span>
                    <span className="text-sm">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="p-4 pt-2 border-t border-gray-100 space-y-3 bg-white">
                      {/* Control Quantité */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Quantité:</span>
                        <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="w-7 h-7 bg-white text-gray-700 font-bold rounded shadow-sm hover:bg-gray-200 flex items-center justify-center transition"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-gray-800 text-sm">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="w-7 h-7 bg-white text-gray-700 font-bold rounded shadow-sm hover:bg-gray-200 flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Input Notes */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Ajouter une note:
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Sans oignon, bien cuit..."
                          value={notes[product.id] || ''}
                          onChange={(e) => handleNoteChange(product.id, e.target.value)}
                          style={{ outlineColor: '#E58730' }}
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#E58730]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resume & Bouton Commander sur WhatsApp */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total:</span>
            <span className="font-semibold">{subtotal} DH</span>
          </div>

          {discount > 0 && (
            <div 
              style={{ color: '#649714' }}
              className="flex justify-between font-bold"
            >
              <span>Remise (Semaine Complète):</span>
              <span>-10 DH</span>
            </div>
          )}

          <div 
            style={{ color: '#204115' }}
            className="flex justify-between text-lg font-black border-t pt-2"
          >
            <span>Total:</span>
            <span>{total} DH</span>
          </div>
        </div>

        <button
          onClick={handleWhatsAppOrder}
          style={{ backgroundColor: '#649714' }}
          className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:bg-[#204115] transition duration-200 flex items-center justify-center space-x-2 text-base"
        >
          <span>Demander sur WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default Card;