import React, { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import { Icon } from '@iconify-icon/react'

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)
  const quickCreateRef = useRef<HTMLDivElement | null>(null)
  const quickCreateOptions = [
    { label: 'Quote', icon: 'lucide:file-text' },
    { label: 'Load', icon: 'lucide:truck' },
    { label: 'RFP', icon: 'lucide:file-input' },
    { label: 'Carrier', icon: 'lucide:users' },
    { label: 'Contact', icon: 'lucide:user-plus' }
  ]

  useEffect(() => {
    if (!quickCreateOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!quickCreateRef.current) return
      if (!quickCreateRef.current.contains(event.target as Node)) {
        setQuickCreateOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuickCreateOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [quickCreateOpen])

  const handleQuickCreateToggle = () => {
    setQuickCreateOpen((open) => !open)
  }

  const handleQuickCreateSelect = () => {
    setQuickCreateOpen(false)
  }
  return (
    <Wrapper $collapsed={collapsed}>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <Main $collapsed={collapsed}>
        <GlobalTopbar $collapsed={collapsed}>
          <QuickCreateWrapper ref={quickCreateRef}>
            <QuickCreateButton
              type="button"
              onClick={handleQuickCreateToggle}
              aria-haspopup="menu"
              aria-expanded={quickCreateOpen}
            >
              <Icon icon="lucide:plus" className="icon" aria-hidden="true" />
              <span>Quick Create</span>
            </QuickCreateButton>
            {quickCreateOpen && (
              <QuickCreateMenu role="menu">
                {quickCreateOptions.map(({ label, icon }) => (
                  <QuickCreateMenuItem key={label}>
                    <QuickCreateMenuButton type="button" role="menuitem" onClick={handleQuickCreateSelect}>
                      <Icon icon={icon} className="icon" aria-hidden="true" />
                      <span>{label}</span>
                    </QuickCreateMenuButton>
                  </QuickCreateMenuItem>
                ))}
              </QuickCreateMenu>
            )}
          </QuickCreateWrapper>
          <SearchWrapper role="search">
            <Icon icon="lucide:search" className="icon" aria-hidden="true" />
            <SearchInput type="search" placeholder="Search..." aria-label="Global search" />
          </SearchWrapper>
          <TopbarActions>
            <IconButton type="button" aria-label="Open notifications">
              <Icon icon="mdi:bell-outline" className="icon" aria-hidden="true" />
            </IconButton>
            <IconButton type="button" aria-label="Open AI command bar" $withLabel>
              <Icon icon="mdi:robot-outline" className="icon" aria-hidden="true" />
              <span>AI Command Bar</span>
            </IconButton>
          </TopbarActions>
        </GlobalTopbar>
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Wrapper>
  )
}

export default AppLayout

// styled-components (kept below the component at module scope per project rules)
const sidebarWidth = '264px'
const collapsedWidth = '73px'
const breakpoint = '768px'
const topbarHeight = '80px'

const Wrapper = styled.div<{ $collapsed: boolean }>`
  display: block;
  min-height: 100dvh;
  width: 100dvw;
  box-sizing: border-box;
  /* Prevent any descendant from causing page-level horizontal scroll */
  overflow-x: hidden;
`

const Main = styled.main<{ $collapsed: boolean }>`
  box-sizing: border-box;
  /* Constrain to viewport width minus sidebar to avoid overflow; use dvw to exclude scrollbar width */
  width: calc(100dvw - ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)});
  max-width: calc(100dvw - ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)});
  min-width: 0;
  min-height: 100dvh;
  padding: 0;
  padding-top: ${topbarHeight};
  position: relative; /* create a local stacking context below the tab */
  z-index: 0;
  margin: 0;
  margin-left: ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)};
  display: flex;
  flex-direction: column;
  
  /* Keep page from introducing horizontal scroll while allowing the fixed tab to overlay */
  overflow-x: hidden;
`

const GlobalTopbar = styled.header<{ $collapsed: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(240px, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  padding-left: 48px;
  background: rgba(15, 23, 42, 0.92);
  color: #e2e8f0;
  position: fixed;
  top: 0;
  left: ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)};
  width: calc(100dvw - ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)});
  min-height: ${topbarHeight};
  box-sizing: border-box;
  z-index: 50;
  backdrop-filter: saturate(120%) blur(8px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);

  @media (max-width: ${breakpoint}) {
    left: 0;
    width: 100dvw;
  }
`

const QuickCreateMenu = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 100%;
  padding: 8px;
  margin: 0;
  list-style: none;
  background: rgba(15, 23, 42, 0.96);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.45);
  z-index: 60;
`

const QuickCreateMenuItem = styled.li`
  width: 100%;
`

const QuickCreateMenuButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #f8fafc;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 160ms ease, transform 120ms ease;

  &:hover {
    background: rgba(220, 20, 60, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    background: rgba(220, 20, 60, 0.28);
    transform: translateY(0);
  }

  .icon {
    font-size: 18px;
  }
`

const QuickCreateWrapper = styled.div`
  position: relative;
  display: inline-flex;
`

const QuickCreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #dc143c, #a00e2b);
  color: #f8fafc;
  font-weight: 600;
  font-size: 14px;
  transition: transform 120ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(220, 20, 60, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(220, 20, 60, 0.28);
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`

const SearchWrapper = styled.form`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.35);
  border-radius: 12px;
  padding: 10px 16px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  color: #cbd5e1;

  .icon {
    width: 20px;
    height: 20px;
  }
`

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #f8fafc;
  font-size: 14px;
  width: 100%;

  &::placeholder {
    color: #94a3b8;
  }
`

const TopbarActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`

const IconButton = styled.button<{ $withLabel?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => (p.$withLabel ? '8px' : '0')};
  justify-content: center;
  padding: ${(p) => (p.$withLabel ? '10px 16px' : '10px')};
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.35);
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  transition: background 160ms ease, transform 120ms ease, box-shadow 160ms ease;

  &:hover {
    background: rgba(220, 20, 60, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.3);
  }

  .icon {
    width: 18px;
    height: 18px;
  }
`

const Content = styled.div`
  flex: 1;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
`