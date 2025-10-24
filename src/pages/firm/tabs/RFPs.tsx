import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
import { useAlert } from '../../../components/AlertProvider';
import * as XLSX from 'xlsx';

const RFPs: React.FC = () => {
  const client = useMemo(() => generateClient<Schema>({ authMode: 'userPool' } as any), []);
  const alertApi = useAlert();

  // State
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Required fields for mapping
  const requiredFields = [
    { key: 'origin', label: 'Origin (O/D)' },
    { key: 'destination', label: 'Destination (O/D)' },
    { key: 'equipment_type', label: 'Equipment Type' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'notes', label: 'Notes' },
  ];

  // Load uploads
  useEffect(() => {
    loadUploads();
    loadTemplates();
  }, []);

  const loadUploads = async () => {
    setLoading(true);
    try {
      const { data } = await client.models.RFPUpload.list();
      setUploads((data || []).sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      ));
    } catch (error) {
      alertApi.error({ title: 'Failed to load uploads', message: 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data } = await client.models.CustomerTemplate.list();
      setTemplates(data || []);
    } catch (error) {
      // Error loading templates
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFileUpload(files[0]);
    }
  };

  const processFileUpload = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(file.type)) {
      alertApi.error({ title: 'Invalid file type', message: 'Please upload Excel or CSV file.' });
      return;
    }

    setSelectedFile(file);
    parseFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(file.type)) {
      alertApi.error({ title: 'Invalid file type', message: 'Please upload Excel or CSV file.' });
      return;
    }

    setSelectedFile(file);
    parseFile(file);
  };

  const parseFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length < 2) {
          alertApi.error({ title: 'Invalid file', message: 'File must contain headers and data.' });
          return;
        }

        const headers = (jsonData[0] as any[]).map(h => String(h || ''));
        const rows = jsonData.slice(1).filter((row: any) => row.length > 0);

        setHeaders(headers);
        setParsedData(rows);
        setShowUploadModal(false);
        setShowColumnMapper(true);
      } catch (error) {
        alertApi.error({ title: 'Parse error', message: 'Failed to parse file.' });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template?.column_mappings) {
      try {
        const mappings = JSON.parse(template.column_mappings);
        setColumnMappings(mappings);
      } catch (error) {
        // Error parsing template
      }
    }
  };

  const saveTemplate = async () => {
    if (!customerName.trim()) {
      alertApi.error({ title: 'Customer name required', message: 'Please enter customer name.' });
      return;
    }

    try {
      await client.models.CustomerTemplate.create({
        customer_name: customerName,
        template_name: `${customerName} Template`,
        column_mappings: JSON.stringify(columnMappings),
        created_at: new Date().toISOString(),
      } as any);

      alertApi.success({ title: 'Template saved', message: 'Column mapping saved for future use.' });
      loadTemplates();
    } catch (error) {
      alertApi.error({ title: 'Failed to save template', message: 'Please try again.' });
    }
  };

  const processUpload = async () => {
    if (!selectedFile || !customerName.trim()) {
      alertApi.error({ title: 'Missing information', message: 'Please provide customer name.' });
      return;
    }

    // Validate mappings
    const missingMappings = requiredFields.filter(field => !columnMappings[field.key]);
    if (missingMappings.length > 0) {
      alertApi.error({ 
        title: 'Missing mappings', 
        message: `Please map: ${missingMappings.map(f => f.label).join(', ')}` 
      });
      return;
    }

    setUploading(true);
    try {
      // Create upload record
      const uploadResult = await client.models.RFPUpload.create({
        customer_name: customerName,
        file_name: selectedFile.name,
        total_lanes: parsedData.length,
        processed_lanes: 0,
        status: 'PROCESSING',
        created_at: new Date().toISOString(),
      } as any);

      const uploadId = uploadResult.data?.id;
      if (!uploadId) throw new Error('Failed to create upload record');

      // Process lanes
      let processedCount = 0;
      const batchSize = 25;
      
      for (let i = 0; i < parsedData.length; i += batchSize) {
        const batch = parsedData.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (row: any) => {
            const lane = {
              rfp_upload_id: uploadId,
              lane_number: String(i + batch.indexOf(row) + 1),
              origin: String(row[headers.indexOf(columnMappings.origin)] || ''),
              destination: String(row[headers.indexOf(columnMappings.destination)] || ''),
              equipment_type: String(row[headers.indexOf(columnMappings.equipment_type)] || ''),
              frequency: String(row[headers.indexOf(columnMappings.frequency)] || ''),
              start_date: String(row[headers.indexOf(columnMappings.start_date)] || ''),
              notes: String(row[headers.indexOf(columnMappings.notes)] || ''),
              created_at: new Date().toISOString(),
            };

            await client.models.RFPLane.create(lane as any);
            processedCount++;
          })
        );

        // Update progress
        await client.models.RFPUpload.update({
          id: uploadId,
          processed_lanes: processedCount,
        } as any);
      }

      // Mark as completed
      await client.models.RFPUpload.update({
        id: uploadId,
        status: 'COMPLETED',
        processed_lanes: parsedData.length,
      } as any);

      alertApi.success({ 
        title: 'Upload completed', 
        message: `${parsedData.length} lanes imported successfully!` 
      });

      // Reset state
      setShowColumnMapper(false);
      setSelectedFile(null);
      setCustomerName('');
      setParsedData([]);
      setHeaders([]);
      setColumnMappings({});
      loadUploads();
    } catch (error: any) {
      alertApi.error({ title: 'Upload failed', message: error?.message || 'Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Page>
      <Header>
        <div>
          <Title>RFPs - Bulk Import & Matching</Title>
          <Subtitle>Upload customer RFPs, analyze pricing, and generate quotes</Subtitle>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          + Upload RFP
        </Button>
      </Header>

      {loading ? (
        <LoadingState>Loading uploads...</LoadingState>
      ) : (
        <>
          <StatsGrid>
            <StatCard>
              <StatLabel>Total Uploads</StatLabel>
              <StatValue>{uploads.length}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Lanes</StatLabel>
              <StatValue>{uploads.reduce((sum, u) => sum + (u.total_lanes || 0), 0)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Processing</StatLabel>
              <StatValue>{uploads.filter(u => u.status === 'PROCESSING').length}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Completed</StatLabel>
              <StatValue>{uploads.filter(u => u.status === 'COMPLETED').length}</StatValue>
            </StatCard>
          </StatsGrid>

          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>File Name</Th>
                  <Th>Lanes</Th>
                  <Th>Status</Th>
                  <Th>Uploaded</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => (
                  <tr key={upload.id}>
                    <Td><strong>{upload.customer_name}</strong></Td>
                    <Td>{upload.file_name}</Td>
                    <Td>{upload.processed_lanes || 0} / {upload.total_lanes || 0}</Td>
                    <Td>
                      <StatusBadge status={upload.status}>
                        {upload.status || 'UNKNOWN'}
                      </StatusBadge>
                    </Td>
                    <Td>{upload.created_at ? new Date(upload.created_at).toLocaleDateString() : '-'}</Td>
                    <Td>
                      <ActionButton>View Lanes</ActionButton>
                    </Td>
                  </tr>
                ))}
                {uploads.length === 0 && (
                  <tr>
                    <Td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                      No uploads yet. Click "Upload RFP" to get started.
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrap>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal onClick={() => setShowUploadModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <ModalHeader>
              <div>
                <h3 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Upload RFP File</h3>
                <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Import customer RFP for bulk lane pricing</p>
              </div>
              <CloseButton onClick={() => setShowUploadModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Customer Name *</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name (e.g., Acme Logistics)"
                  autoFocus
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Upload File *</Label>
                <UploadArea
                  $isDragging={isDragging}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  {!selectedFile ? (
                    <>
                      <UploadIcon>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </UploadIcon>
                      <UploadText>
                        <strong>Drop your file here</strong> or click to browse
                      </UploadText>
                      <UploadSubtext>
                        Supports Excel (.xlsx, .xls) and CSV files
                      </UploadSubtext>
                    </>
                  ) : (
                    <FilePreview>
                      <FileIcon>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      </FileIcon>
                      <FileInfo>
                        <FileName>{selectedFile.name}</FileName>
                        <FileSize>{(selectedFile.size / 1024).toFixed(2)} KB</FileSize>
                      </FileInfo>
                      <RemoveFileButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setParsedData([]);
                          setHeaders([]);
                        }}
                      >
                        ✕
                      </RemoveFileButton>
                    </FilePreview>
                  )}
                  <HiddenFileInput
                    id="file-input"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                  />
                </UploadArea>
              </FormGroup>

              {selectedFile && (
                <InfoBox>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>File loaded successfully! Click Continue to map columns.</span>
                </InfoBox>
              )}

              <ButtonGroup>
                <SecondaryButton onClick={() => setShowUploadModal(false)}>
                  Cancel
                </SecondaryButton>
                <Button 
                  onClick={() => {
                    if (!customerName.trim()) {
                      alertApi.error({ title: 'Customer name required', message: 'Please enter customer name.' });
                      return;
                    }
                    if (!selectedFile) {
                      alertApi.error({ title: 'File required', message: 'Please select a file to upload.' });
                      return;
                    }
                    // File is already parsed, just show mapper
                    setShowUploadModal(false);
                    setShowColumnMapper(true);
                  }}
                  disabled={!selectedFile || !customerName.trim()}
                >
                  Continue →
                </Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Column Mapper Modal */}
      {showColumnMapper && (
        <Modal onClick={() => setShowColumnMapper(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <ModalHeader>
              <h3>Map Columns</h3>
              <CloseButton onClick={() => setShowColumnMapper(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <Info>
                Map your file columns to our system fields. Found {parsedData.length} rows.
              </Info>

              {templates.length > 0 && (
                <FormGroup>
                  <Label>Load Saved Template</Label>
                  <Select 
                    value={selectedTemplateId} 
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                  >
                    <option value="">-- Select template --</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.template_name}</option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              {requiredFields.map((field) => (
                <FormGroup key={field.key}>
                  <Label>{field.label}</Label>
                  <Select
                    value={columnMappings[field.key] || ''}
                    onChange={(e) => setColumnMappings({ ...columnMappings, [field.key]: e.target.value })}
                  >
                    <option value="">-- Select column --</option>
                    {headers.map((header, idx) => (
                      <option key={idx} value={header}>{header}</option>
                    ))}
                  </Select>
                </FormGroup>
              ))}

              <ButtonGroup>
                <SecondaryButton onClick={saveTemplate}>
                  Save Template
                </SecondaryButton>
                <Button onClick={processUpload} disabled={uploading}>
                  {uploading ? 'Processing...' : 'Import Lanes'}
                </Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Page>
  );
};

export default RFPs;

// Styled Components
const Page = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0 0 6px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #dc143c, #a00e2b);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #0b5ed7; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  color: #1f2937;
  font-size: 32px;
  font-weight: 700;
`;

const TableWrap = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;
`;

const StatusBadge = styled.span<{ status?: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => 
    p.status === 'COMPLETED' ? '#d1fae5' :
    p.status === 'PROCESSING' ? '#fef3c7' :
    p.status === 'FAILED' ? '#fee2e2' : '#e5e7eb'
  };
  color: ${p => 
    p.status === 'COMPLETED' ? '#065f46' :
    p.status === 'PROCESSING' ? '#92400e' :
    p.status === 'FAILED' ? '#991b1b' : '#374151'
  };
`;

const ActionButton = styled.button`
  background: transparent;
  color: #0d6efd;
  border: 1px solid #0d6efd;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #0d6efd; color: white; }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  h3 { margin: 0; color: #1f2937; }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 28px;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  &:hover { color: #1f2937; }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  &:focus { outline: none; border-color: #0d6efd; }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  &:focus { outline: none; border-color: #0d6efd; }
`;

const Info = styled.div`
  padding: 12px;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const SecondaryButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #f9fafb; }
`;

// Enhanced Upload Area Styles
const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${p => p.$isDragging ? '#0d6efd' : '#d1d5db'};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$isDragging ? '#eff6ff' : '#fafbfc'};
  position: relative;

  &:hover {
    border-color: #0d6efd;
    background: #f8faff;
  }
`;

const UploadIcon = styled.div`
  color: #0d6efd;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  opacity: 0.8;
`;

const UploadText = styled.p`
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 16px;
  
  strong {
    color: #0d6efd;
    font-weight: 600;
  }
`;

const UploadSubtext = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const FileIcon = styled.div`
  color: #0d6efd;
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  flex: 1;
  text-align: left;
  min-width: 0;
`;

const FileName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.div`
  color: #6b7280;
  font-size: 13px;
`;

const RemoveFileButton = styled.button`
  background: #fee2e2;
  color: #991b1b;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #fecaca;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1e40af;
  font-size: 14px;
  margin-top: 16px;
  
  svg {
    flex-shrink: 0;
  }
`;
