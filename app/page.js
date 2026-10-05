"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Gagal mengambil data produk: " + error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const totalProduk = products.length;

  const totalStok = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const stokMenipis = products.filter(
    (product) =>
      Number(product.stock || 0) <= Number(product.minimum_stock || 0)
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>
            📊 Sistem Stok Percetakan
          </h1>

          <p style={{ color: "#666", marginTop: "8px" }}>
            Dashboard persediaan banner & percetakan
          </p>
        </div>

        {/* SUMMARY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div style={cardStyle}>
            <div style={iconStyle}>📦</div>
            <div>
              <div style={labelStyle}>Total Produk</div>
              <div style={numberStyle}>{totalProduk}</div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}>📊</div>
            <div>
              <div style={labelStyle}>Total Stok</div>
              <div style={numberStyle}>{totalStok}</div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconStyle}>⚠️</div>
            <div>
              <div style={labelStyle}>Stok Menipis</div>
              <div style={numberStyle}>{stokMenipis}</div>
            </div>
          </div>
        </div>

        {/* PRODUK */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>📦 Master Produk</h2>
              <p style={{ color: "#777" }}>
                Data produk yang tersimpan di database
              </p>
            </div>

            <button
              onClick={loadProducts}
              style={{
                border: "none",
                background: "#111827",
                color: "white",
                padding: "10px 16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <p>Memuat data...</p>
          ) : products.length === 0 ? (
            <p>Belum ada produk.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th style={thStyle}>Produk</th>
                    <th style={thStyle}>Kategori</th>
                    <th style={thStyle}>Material</th>
                    <th style={thStyle}>Satuan</th>
                    <th style={thStyle}>Harga Jual</th>
                    <th style={thStyle}>Stok</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td style={tdStyle}>
                        <strong>{product.name}</strong>
                      </td>

                      <td style={tdStyle}>
                        {product.category || "-"}
                      </td>

                      <td style={tdStyle}>
                        {product.material || "-"}
                      </td>

                      <td style={tdStyle}>
                        {product.unit || "pcs"}
                      </td>

                      <td style={tdStyle}>
                        Rp{" "}
                        {Number(product.selling_price || 0).toLocaleString(
                          "id-ID"
                        )}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              Number(product.stock || 0) <=
                              Number(product.minimum_stock || 0)
                                ? "#dc2626"
                                : "#16a34a",
                          }}
                        >
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "22px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
};

const iconStyle = {
  fontSize: "32px",
};

const labelStyle = {
  color: "#6b7280",
  fontSize: "14px",
};

const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "4px",
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #f1f1f1",
  fontSize: "14px",
};
