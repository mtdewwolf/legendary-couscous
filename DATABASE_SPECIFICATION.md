# Database Specification for Goldminedistro

## Overview

This document provides the complete database specification for the Goldminedistro inventory management system. The database will be built using PostgreSQL and should support all the features currently implemented in the frontend application.

## Database Requirements

### Technology Stack
- **Database**: PostgreSQL 15+
- **Connection**: Support for connection pooling (recommend pgBouncer for production)
- **Backup**: Automated daily backups with point-in-time recovery
- **Performance**: Optimized for read-heavy workloads with some write operations

### Security Requirements
- Encrypted connections (SSL/TLS)
- Role-based access control
- Audit logging for critical operations
- Data encryption at rest (optional but recommended)

## Database Schema

### 1. Core Tables

#### 1.1 Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin', 'manager', 'user'
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.2 Vendors Table
```sql
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    category VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.3 Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.4 Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    vendor_id INTEGER REFERENCES vendors(id),
    our_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    reorder_level INTEGER DEFAULT 0,
    on_hand INTEGER DEFAULT 0,
    unit_of_measure VARCHAR(50) DEFAULT 'each',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.5 Purchase Orders Table
```sql
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id INTEGER REFERENCES vendors(id) NOT NULL,
    order_date DATE NOT NULL,
    expected_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.6 Purchase Order Items Table
```sql
CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL, -- Denormalized for historical accuracy
    quantity INTEGER NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.7 Receiving Orders Table
```sql
CREATE TABLE receiving_orders (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER REFERENCES purchase_orders(id),
    receiving_number VARCHAR(50) UNIQUE NOT NULL,
    received_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
    notes TEXT,
    received_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.8 Receiving Items Table
```sql
CREATE TABLE receiving_items (
    id SERIAL PRIMARY KEY,
    receiving_order_id INTEGER REFERENCES receiving_orders(id) ON DELETE CASCADE,
    purchase_order_item_id INTEGER REFERENCES purchase_order_items(id),
    product_id INTEGER REFERENCES products(id),
    expected_quantity INTEGER NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 1.9 Inventory Transactions Table
```sql
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'receiving', 'adjustment', 'sale', 'return'
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reference_id INTEGER, -- ID of related order/transaction
    reference_type VARCHAR(50), -- 'purchase_order', 'receiving_order', 'adjustment'
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Configuration Tables

#### 2.1 Company Settings Table
```sql
CREATE TABLE company_settings (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.2 System Settings Table
```sql
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Audit and Logging Tables

#### 3.1 Audit Log Table
```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

### Performance Indexes
```sql
-- Products table indexes
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_active ON products(is_active);

-- Purchase orders indexes
CREATE INDEX idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_order_date ON purchase_orders(order_date);
CREATE INDEX idx_purchase_orders_order_number ON purchase_orders(order_number);

-- Purchase order items indexes
CREATE INDEX idx_purchase_order_items_order_id ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_purchase_order_items_product_id ON purchase_order_items(product_id);

-- Receiving orders indexes
CREATE INDEX idx_receiving_orders_purchase_order_id ON receiving_orders(purchase_order_id);
CREATE INDEX idx_receiving_orders_status ON receiving_orders(status);
CREATE INDEX idx_receiving_orders_receiving_number ON receiving_orders(receiving_number);

-- Receiving items indexes
CREATE INDEX idx_receiving_items_receiving_order_id ON receiving_items(receiving_order_id);
CREATE INDEX idx_receiving_items_product_id ON receiving_items(product_id);

-- Inventory transactions indexes
CREATE INDEX idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_created_at ON inventory_transactions(created_at);

-- Audit log indexes
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

## Views

### 1. Product Summary View
```sql
CREATE VIEW product_summary AS
SELECT 
    p.id,
    p.product_name,
    p.barcode,
    p.sku,
    p.our_cost,
    p.on_hand,
    p.reorder_level,
    c.name as category_name,
    v.name as vendor_name,
    CASE 
        WHEN p.on_hand = 0 THEN 'Out of Stock'
        WHEN p.on_hand <= p.reorder_level THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN vendors v ON p.vendor_id = v.id
WHERE p.is_active = true;
```

### 2. Purchase Order Summary View
```sql
CREATE VIEW purchase_order_summary AS
SELECT 
    po.id,
    po.order_number,
    po.order_date,
    po.expected_date,
    po.status,
    po.total_amount,
    v.name as vendor_name,
    v.contact_person as vendor_contact,
    COUNT(poi.id) as item_count,
    SUM(poi.quantity) as total_quantity
FROM purchase_orders po
LEFT JOIN vendors v ON po.vendor_id = v.id
LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
GROUP BY po.id, po.order_number, po.order_date, po.expected_date, po.status, po.total_amount, v.name, v.contact_person;
```

### 3. Receiving Summary View
```sql
CREATE VIEW receiving_summary AS
SELECT 
    ro.id,
    ro.receiving_number,
    ro.received_date,
    ro.status,
    po.order_number as purchase_order_number,
    v.name as vendor_name,
    COUNT(ri.id) as item_count,
    SUM(ri.expected_quantity) as total_expected,
    SUM(ri.received_quantity) as total_received
FROM receiving_orders ro
LEFT JOIN purchase_orders po ON ro.purchase_order_id = po.id
LEFT JOIN vendors v ON po.vendor_id = v.id
LEFT JOIN receiving_items ri ON ro.id = ri.receiving_order_id
GROUP BY ro.id, ro.receiving_number, ro.received_date, ro.status, po.order_number, v.name;
```

## Stored Procedures

### 1. Update Product Stock
```sql
CREATE OR REPLACE FUNCTION update_product_stock(
    p_product_id INTEGER,
    p_quantity_change INTEGER,
    p_transaction_type VARCHAR(50),
    p_unit_cost DECIMAL(10,2) DEFAULT NULL,
    p_reference_id INTEGER DEFAULT NULL,
    p_reference_type VARCHAR(50) DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_user_id INTEGER DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Update product stock
    UPDATE products 
    SET on_hand = on_hand + p_quantity_change,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_product_id;
    
    -- Record transaction
    INSERT INTO inventory_transactions (
        product_id, transaction_type, quantity, unit_cost, 
        total_cost, reference_id, reference_type, notes, created_by
    ) VALUES (
        p_product_id, p_transaction_type, p_quantity_change, p_unit_cost,
        COALESCE(p_unit_cost * p_quantity_change, 0), p_reference_id, 
        p_reference_type, p_notes, p_user_id
    );
END;
$$ LANGUAGE plpgsql;
```

### 2. Complete Receiving Order
```sql
CREATE OR REPLACE FUNCTION complete_receiving_order(
    p_receiving_order_id INTEGER,
    p_user_id INTEGER
) RETURNS VOID AS $$
DECLARE
    v_receiving_item RECORD;
BEGIN
    -- Update receiving order status
    UPDATE receiving_orders 
    SET status = 'completed', updated_at = CURRENT_TIMESTAMP
    WHERE id = p_receiving_order_id;
    
    -- Process each receiving item
    FOR v_receiving_item IN 
        SELECT * FROM receiving_items 
        WHERE receiving_order_id = p_receiving_order_id
    LOOP
        -- Update product stock
        PERFORM update_product_stock(
            v_receiving_item.product_id,
            v_receiving_item.received_quantity,
            'receiving',
            NULL,
            p_receiving_order_id,
            'receiving_order',
            'Received via receiving order',
            p_user_id
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## Triggers

### 1. Updated At Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_receiving_orders_updated_at BEFORE UPDATE ON receiving_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Audit Log Trigger
```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
        VALUES (current_setting('app.current_user_id', true)::integer, 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (current_setting('app.current_user_id', true)::integer, 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (user_id, action, table_name, record_id, old_values)
        VALUES (current_setting('app.current_user_id', true)::integer, 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_products_trigger AFTER INSERT OR UPDATE OR DELETE ON products FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_purchase_orders_trigger AFTER INSERT OR UPDATE OR DELETE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_receiving_orders_trigger AFTER INSERT OR UPDATE OR DELETE ON receiving_orders FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

## Sample Data

### Initial Categories
```sql
INSERT INTO categories (name, description) VALUES
('Beverages', 'Coffee, tea, and other beverages'),
('Confectionery', 'Chocolate, candies, and sweets'),
('Spices', 'Herbs, spices, and seasonings'),
('Natural Products', 'Organic and natural products'),
('Dairy', 'Milk, cheese, and dairy products'),
('Grains', 'Rice, pasta, and grains');
```

### Initial System Settings
```sql
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('low_stock_alerts', 'true', 'boolean', 'Enable low stock alerts'),
('auto_generate_po', 'false', 'boolean', 'Auto-generate purchase orders'),
('default_reorder_level', '20', 'number', 'Default reorder level for new products'),
('currency', 'USD', 'string', 'Default currency'),
('email_notifications', 'true', 'boolean', 'Enable email notifications'),
('weekly_reports', 'false', 'boolean', 'Enable weekly reports');
```

## API Endpoints Needed

The frontend application will need the following API endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/stock` - Update stock level

### Vendors
- `GET /api/vendors` - List vendors
- `GET /api/vendors/:id` - Get single vendor
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Purchase Orders
- `GET /api/purchase-orders` - List purchase orders
- `GET /api/purchase-orders/:id` - Get single purchase order
- `POST /api/purchase-orders` - Create purchase order
- `PUT /api/purchase-orders/:id` - Update purchase order
- `DELETE /api/purchase-orders/:id` - Delete purchase order

### Receiving
- `GET /api/receiving` - List receiving orders
- `GET /api/receiving/:id` - Get single receiving order
- `POST /api/receiving` - Create receiving order
- `PUT /api/receiving/:id` - Update receiving order
- `POST /api/receiving/:id/complete` - Complete receiving order

### Reports
- `GET /api/reports/inventory` - Inventory reports
- `GET /api/reports/vendors` - Vendor performance reports
- `GET /api/reports/purchase-orders` - Purchase order reports

## Performance Considerations

1. **Connection Pooling**: Use pgBouncer or similar for connection pooling
2. **Query Optimization**: Ensure all frequently used queries use indexes
3. **Partitioning**: Consider partitioning large tables (audit_log, inventory_transactions) by date
4. **Caching**: Implement application-level caching for frequently accessed data
5. **Backup Strategy**: Daily backups with point-in-time recovery capability

## Security Considerations

1. **Row Level Security**: Implement RLS for multi-tenant scenarios
2. **Encryption**: Encrypt sensitive data at rest
3. **Access Control**: Use database roles and permissions
4. **Audit Logging**: Log all critical operations
5. **Input Validation**: Validate all inputs at the application level

## Migration Strategy

1. **Version Control**: Use database migrations for schema changes
2. **Rollback Plan**: Ensure all migrations can be rolled back
3. **Testing**: Test migrations on staging environment first
4. **Backup**: Take full backup before applying migrations

## Monitoring and Maintenance

1. **Performance Monitoring**: Monitor query performance and slow queries
2. **Disk Space**: Monitor disk usage and growth
3. **Connection Monitoring**: Monitor active connections and connection pool usage
4. **Regular Maintenance**: Schedule regular VACUUM and ANALYZE operations

---

This specification provides a complete foundation for the Goldminedistro database. The PostgreSQL developer should implement this schema and ensure all the relationships, constraints, and performance optimizations are in place.
