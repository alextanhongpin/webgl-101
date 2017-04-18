<?xml version="1.0" encoding="utf-8"?>
<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
  <asset>
    <contributor>
      <author>Blender User</author>
      <authoring_tool>Blender 2.74.0 commit date:2015-03-31, commit time:13:39, hash:000dfc0</authoring_tool>
    </contributor>
    <created>2015-05-28T01:42:36</created>
    <modified>2015-05-28T01:42:36</modified>
    <unit name="meter" meter="1"/>
    <up_axis>Z_UP</up_axis>
  </asset>
  <library_cameras>
    <camera id="Camera-camera" name="Camera">
      <optics>
        <technique_common>
          <perspective>
            <xfov sid="xfov">49.13434</xfov>
            <aspect_ratio>1.777778</aspect_ratio>
            <znear sid="znear">0.1</znear>
            <zfar sid="zfar">100</zfar>
          </perspective>
        </technique_common>
      </optics>
      <extra>
        <technique profile="blender">
          <YF_dofdist>0</YF_dofdist>
          <shiftx>0</shiftx>
          <shifty>0</shifty>
        </technique>
      </extra>
    </camera>
  </library_cameras>
  <library_lights>
    <light id="Lamp-light" name="Lamp">
      <technique_common>
        <point>
          <color sid="color">1 1 1</color>
          <constant_attenuation>1</constant_attenuation>
          <linear_attenuation>0</linear_attenuation>
          <quadratic_attenuation>0.00111109</quadratic_attenuation>
        </point>
      </technique_common>
      <extra>
        <technique profile="blender">
          <adapt_thresh>0.000999987</adapt_thresh>
          <area_shape>1</area_shape>
          <area_size>0.1</area_size>
          <area_sizey>0.1</area_sizey>
          <area_sizez>1</area_sizez>
          <atm_distance_factor>1</atm_distance_factor>
          <atm_extinction_factor>1</atm_extinction_factor>
          <atm_turbidity>2</atm_turbidity>
          <att1>0</att1>
          <att2>1</att2>
          <backscattered_light>1</backscattered_light>
          <bias>1</bias>
          <blue>1</blue>
          <buffers>1</buffers>
          <bufflag>0</bufflag>
          <bufsize>2880</bufsize>
          <buftype>2</buftype>
          <clipend>30.002</clipend>
          <clipsta>1.000799</clipsta>
          <compressthresh>0.04999995</compressthresh>
          <dist sid="blender_dist">29.99998</dist>
          <energy sid="blender_energy">1</energy>
          <falloff_type>2</falloff_type>
          <filtertype>0</filtertype>
          <flag>0</flag>
          <gamma sid="blender_gamma">1</gamma>
          <green>1</green>
          <halo_intensity sid="blnder_halo_intensity">1</halo_intensity>
          <horizon_brightness>1</horizon_brightness>
          <mode>8192</mode>
          <ray_samp>1</ray_samp>
          <ray_samp_method>1</ray_samp_method>
          <ray_samp_type>0</ray_samp_type>
          <ray_sampy>1</ray_sampy>
          <ray_sampz>1</ray_sampz>
          <red>1</red>
          <samp>3</samp>
          <shadhalostep>0</shadhalostep>
          <shadow_b sid="blender_shadow_b">0</shadow_b>
          <shadow_g sid="blender_shadow_g">0</shadow_g>
          <shadow_r sid="blender_shadow_r">0</shadow_r>
          <sky_colorspace>0</sky_colorspace>
          <sky_exposure>1</sky_exposure>
          <skyblendfac>1</skyblendfac>
          <skyblendtype>1</skyblendtype>
          <soft>3</soft>
          <spotblend>0.15</spotblend>
          <spotsize>75</spotsize>
          <spread>1</spread>
          <sun_brightness>1</sun_brightness>
          <sun_effect_type>0</sun_effect_type>
          <sun_intensity>1</sun_intensity>
          <sun_size>1</sun_size>
          <type>0</type>
        </technique>
      </extra>
    </light>
  </library_lights>
  <library_images/>
  <library_effects>
    <effect id="Material-effect">
      <profile_COMMON>
        <technique sid="common">
          <phong>
            <emission>
              <color sid="emission">0 0 0 1</color>
            </emission>
            <ambient>
              <color sid="ambient">0 0 0 1</color>
            </ambient>
            <diffuse>
              <color sid="diffuse">0.64 0.64 0.64 1</color>
            </diffuse>
            <specular>
              <color sid="specular">0.5 0.5 0.5 1</color>
            </specular>
            <shininess>
              <float sid="shininess">50</float>
            </shininess>
            <index_of_refraction>
              <float sid="index_of_refraction">1</float>
            </index_of_refraction>
          </phong>
        </technique>
      </profile_COMMON>
    </effect>
  </library_effects>
  <library_materials>
    <material id="Material-material" name="Material">
      <instance_effect url="#Material-effect"/>
    </material>
  </library_materials>
  <library_geometries>
    <geometry id="Cube-mesh" name="Cube">
      <mesh>
        <source id="Cube-mesh-positions">
          <float_array id="Cube-mesh-positions-array" count="24">1 1 -1 1 -1 -1 -1 -0.9999998 -1 -0.9999997 1 -1 1 0.9999995 1 0.9999994 -1.000001 1 -1 -0.9999997 1 -1 1 1</float_array>
          <technique_common>
            <accessor source="#Cube-mesh-positions-array" count="8" stride="3">
              <param name="X" type="float"/>
              <param name="Y" type="float"/>
              <param name="Z" type="float"/>
            </accessor>
          </technique_common>
        </source>
        <source id="Cube-mesh-normals">
          <float_array id="Cube-mesh-normals-array" count="36">0 0 -1 0 0 1 1 -5.66244e-7 3.27825e-7 -4.76837e-7 -1 0 -1 2.08616e-7 -1.19209e-7 2.08616e-7 1 1.78814e-7 0 0 -1 0 0 1 1 0 -2.38419e-7 0 -1 -2.98023e-7 -1 2.38419e-7 -1.49012e-7 2.68221e-7 1 2.38419e-7</float_array>
          <technique_common>
            <accessor source="#Cube-mesh-normals-array" count="12" stride="3">
              <param name="X" type="float"/>
              <param name="Y" type="float"/>
              <param name="Z" type="float"/>
            </accessor>
          </technique_common>
        </source>
        <vertices id="Cube-mesh-vertices">
          <input semantic="POSITION" source="#Cube-mesh-positions"/>
        </vertices>
        <polylist material="Material-material" count="12">
          <input semantic="VERTEX" source="#Cube-mesh-vertices" offset="0"/>
          <input semantic="NORMAL" source="#Cube-mesh-normals" offset="1"/>
          <vcount>3 3 3 3 3 3 3 3 3 3 3 3 </vcount>
          <p>0 0 1 0 2 0 7 1 6 1 5 1 4 2 5 2 1 2 5 3 6 3 2 3 2 4 6 4 7 4 0 5 3 5 7 5 3 6 0 6 2 6 4 7 7 7 5 7 0 8 4 8 1 8 1 9 5 9 2 9 3 10 2 10 7 10 4 11 0 11 7 11</p>
        </polylist>
      </mesh>
    </geometry>
  </library_geometries>
  <library_controllers/>
  <library_visual_scenes>
    <visual_scene id="Scene" name="Scene">
      <node id="Camera" name="Camera" type="NODE">
        <matrix sid="transform">0.6858805 -0.3173701 0.6548619 7.481132 0.7276338 0.3124686 -0.6106656 -6.50764 -0.01081678 0.8953432 0.4452454 5.343665 0 0 0 1</matrix>
        <instance_camera url="#Camera-camera"/>
      </node>
      <node id="Lamp" name="Lamp" type="NODE">
        <matrix sid="transform">-0.2908646 -0.7711008 0.5663932 4.076245 0.9551712 -0.1998834 0.2183912 1.005454 -0.05518906 0.6045247 0.7946723 5.903862 0 0 0 1</matrix>
        <instance_light url="#Lamp-light"/>
      </node>
      <node id="Cube" name="Cube" type="NODE">
        <matrix sid="transform">1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1</matrix>
        <instance_geometry url="#Cube-mesh">
          <bind_material>
            <technique_common>
              <instance_material symbol="Material-material" target="#Material-material"/>
            </technique_common>
          </bind_material>
        </instance_geometry>
      </node>
    </visual_scene>
  </library_visual_scenes>
  <scene>
    <instance_visual_scene url="#Scene"/>
  </scene>
</COLLADA>